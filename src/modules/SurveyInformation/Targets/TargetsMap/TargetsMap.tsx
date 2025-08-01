import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, Col, Row, Select, Form, message } from "antd";

import { HeaderContainer, Title } from "../../../../shared/Nav.styled";
import SideMenu from "../../SideMenu";

import {
  DescriptionContainer,
  DescriptionText,
  TargetsMapFormWrapper,
  HeadingText,
} from "./TargetsMap.styled";
import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import RowCountBox from "../../../../components/RowCountBox";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import { setLoading } from "../../../../redux/targets/targetSlice";
import { getSurveyCTOForm } from "../../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { getSurveyModuleQuestionnaire } from "../../../../redux/surveyConfig/surveyConfigActions";
import { TargetMapping } from "../../../../redux/targets/types";
import {
  postTargetsMapping,
  updateTargetsColumnConfig,
} from "../../../../redux/targets/targetActions";
import { getSurveyLocationGeoLevels } from "../../../../redux/surveyLocations/surveyLocationsActions";
import { useState, useEffect } from "react";

import { CSVLink } from "react-csv";
import { CustomBtn, GlobalStyle } from "../../../../shared/Global.styled";
import Container from "../../../../components/Layout/Container";
import { resolveSurveyNotification } from "../../../../redux/notifications/notificationActions";
import ErrorWarningTable from "../../../../components/ErrorWarningTable";
import { validateCSVData } from "../../../../utils/csvValidator";

interface CSVError {
  type: string;
  count: number;
  rows: string;
}
function TargetsMap() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };
  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };

  const [targetMappingForm] = Form.useForm();

  const [hasError, setHasError] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);

  const [errorList, setErrorList] = useState<CSVError[]>([]);
  const [hasWarning, setHasWarning] = useState<boolean>(false);
  const [warningList, setWarningList] = useState<CSVError[]>([]);
  const [customHeader, setCustomHeader] = useState<boolean>(false);
  const [customHeaderSelection, setCustomHeaderSelection] = useState<any>({});
  const [checkboxValues, setCheckboxValues] = useState<any>({});
  const [extraCSVHeader, setExtraCSVHeader] = useState<any>();

  const [mandatoryDetailsField, setMandatoryDetailsField] = useState<any>([
    { title: "Target ID", key: "target_id" },
    { title: "Gender", key: "gender" },
    { title: "Language", key: "language" },
  ]);
  const [locationDetailsField, setLocationDetailsField] = useState<any>([]);

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const isLoading = useAppSelector((state: RootState) => state.targets.loading);
  const { loading: isSideMenuLoading } = useAppSelector(
    (state: RootState) => state.surveyConfig
  );

  const quesLoading = useAppSelector(
    (state: RootState) => state.surveyConfig.loading
  );

  const locLoading = useAppSelector(
    (state: RootState) => state.surveyLocations.loading
  );

  const csvHeaders = useAppSelector(
    (state: RootState) => state.targets.csvColumnNames
  );

  const csvRows = useAppSelector((state: RootState) => state.targets.csvRows);

  const csvBase64Data = useAppSelector(
    (state: RootState) => state.targets.csvBase64Data
  );
  const moduleQuestionnaire = useAppSelector(
    (state: RootState) => state.surveyConfig.moduleQuestionnaire
  );
  const surveyLocationGeoLevels = useAppSelector(
    (state: RootState) => state.surveyLocations.surveyLocationGeoLevels
  );

  const customRequiredMarker = (
    label: React.ReactNode,
    { required }: { required: boolean }
  ) => (
    <>
      {required ? (
        <>
          {label} <span style={{ color: "red" }}>*</span>
        </>
      ) : (
        <>{label}</>
      )}
    </>
  );

  const csvHeaderOptions = csvHeaders.map((item, idx) => {
    return { label: item, value: item };
  });

  const handleTargetsUploadMapping = async () => {
    try {
      setErrorCount(0);
      const values = await targetMappingForm.validateFields();
      const column_mapping = targetMappingForm.getFieldsValue();
      if (customHeaderSelection) {
        column_mapping.custom_fields = [];
        const mappedValues = Object.values(column_mapping);
        for (const [column_name, shouldInclude] of Object.entries(
          customHeaderSelection
        )) {
          if (shouldInclude && !mappedValues.includes(column_name)) {
            column_mapping.custom_fields.push({
              column_name: column_name,
              field_label: column_name,
            });
          }
        }
      }

      // Build list of columns to check for empty values
      const columnsToCheck: string[] = [
        // Add all mandatory fields
        ...mandatoryDetailsField
          .map((item: any) => column_mapping[item.key])
          .filter(Boolean),

        // Add all location fields
        ...locationDetailsField
          .map((item: any) => column_mapping[item.key])
          .filter(Boolean),

        // Add custom fields where allow_null is not true
        ...(column_mapping.custom_fields || [])
          .filter((field: any) => !checkboxValues?.[`${field.column_name}`])
          .map((field: any) => field.column_name),
      ];
      // Validate CSV for empty columns (only for columnsToCheck)
      if (columnsToCheck.length > 0) {
        const validationResult = await validateCSVData(
          new File([atob(csvBase64Data)], "data.csv"),
          true,
          columnsToCheck
        );
        if (
          validationResult &&
          "isValid" in validationResult &&
          validationResult.isValid === false &&
          validationResult.inValidData?.length > 0
        ) {
          setHasError(true);
          setErrorList(
            (validationResult.inValidData as string[]).map((msg) => ({
              type: "Validation Error",
              count: 1,
              rows: msg,
            }))
          );
          setErrorCount(csvRows.length - 1);
          message.error(
            "Empty values found in required columns. Please fix and try again."
          );
          return;
        }
      }

      const requestData: TargetMapping = {
        column_mapping: column_mapping,
        file: csvBase64Data,
        mode: "overwrite",
        load_from_scto: false,
        load_successful: false,
      };

      if (form_uid !== undefined) {
        const mappingsRes = await dispatch(
          postTargetsMapping({
            targetMappingData: requestData,
            formUID: form_uid,
          })
        );

        //set error list
        if (mappingsRes.payload.success === false) {
          message.error(mappingsRes.payload.message);

          if (mappingsRes?.payload?.errors) {
            const transformedErrors: CSVError[] = [];

            for (const errorKey in mappingsRes.payload.errors) {
              let errorObj = mappingsRes.payload.errors[errorKey];

              if (errorKey === "record_errors") {
                errorObj =
                  mappingsRes.payload.errors[errorKey]["summary_by_error_type"];

                for (let i = 0; i < errorObj.length; i++) {
                  const summaryError: any = errorObj[i];

                  transformedErrors.push({
                    type: summaryError["error_type"]
                      ? summaryError["error_type"]
                      : errorKey,
                    count: summaryError["error_count"]
                      ? summaryError["error_count"]
                      : errorObj.length,
                    rows: summaryError["error_message"]
                      ? summaryError["error_message"]
                      : errorObj,
                  });
                }
              } else if (errorKey === "column_mapping") {
                const columnErrors = mappingsRes.payload.errors[errorKey];
                errorObj = columnErrors;

                for (const columnError in columnErrors) {
                  transformedErrors.push({
                    type: errorKey,
                    count: columnErrors[columnError].length,
                    rows: `${columnError} - ${columnErrors[columnError]}`,
                  });
                }
              } else {
                transformedErrors.push({
                  type: errorObj["error_type"]
                    ? errorObj["error_type"]
                    : errorKey,
                  count: errorObj.length,
                  rows: errorObj,
                });
              }

              setErrorCount(
                mappingsRes.payload.errors[errorKey]["summary"]
                  ? mappingsRes.payload.errors[errorKey]["summary"][
                      "error_count"
                    ]
                  : errorCount + errorObj.length
              );
            }
            if (errorCount >= csvRows.length) {
              setErrorCount(csvRows.length - 1);
            }
            setErrorList(transformedErrors);
          }
          setHasError(true);
          return;
        }

        if (mappingsRes.payload.success) {
          message.success("Targets uploaded and mapped successfully.");

          handleTargetColumnConfig(form_uid, column_mapping);

          setHasError(false);

          // Set any unresolved target notifications to resolved
          dispatch(
            resolveSurveyNotification({
              survey_uid: survey_uid,
              module_id: 8,
              resolution_status: "done",
            })
          );

          //route to manage
          navigate(`/survey-information/targets/${survey_uid}/${form_uid}`);
        } else {
          message.error("Failed to upload kindly check and try again");
          setHasError(true);
        }
      } else {
        message.error(
          "Kindly check that form_uid is provided in the url to proceed."
        );
        setHasError(true);
      }
    } catch (error) {
      const requiredErrors: any = {};
      const formFields = targetMappingForm.getFieldsValue();

      for (const field in formFields) {
        const errors = targetMappingForm.getFieldError(field);
        if (errors && errors.length > 0) {
          requiredErrors[field] = true;
        }
      }
    }
  };

  const handleCheckboxChange = (name: string) => {
    setCheckboxValues((prevValues: any) => ({
      ...prevValues,
      [name]: prevValues?.[name] === undefined ? false : !prevValues[name],
    }));
  };

  const handleTargetColumnConfig = async (
    formUID: any,
    column_mapping: any
  ) => {
    const customConfig = Object.keys(column_mapping).flatMap((key) => {
      if (
        key !== null &&
        key !== "" &&
        key !== undefined &&
        column_mapping[key] !== undefined
      ) {
        const personal = ["target_id"].includes(key);
        const custom = ["gender", "language"].includes(key);

        const location =
          locationDetailsField.includes(key) ||
          ["location_id_column"].includes(key);

        if (key === "custom_fields") {
          // Loop through the custom fields checking for PII
          const customFields = column_mapping[key];

          return Object.keys(customFields).map((customKey) => {
            const columnName = column_mapping[key][customKey]["column_name"];

            return {
              column_name: columnName,
              column_type: "custom_fields",
              contains_pii: true,
              column_source: columnName,
              allow_null_values: checkboxValues[columnName],
            };
          });
        }

        return {
          column_name:
            key == "location_id_column" ? "bottom_geo_level_location" : key,
          column_type:
            personal || custom
              ? "basic_details"
              : location
              ? "location"
              : "custom_fields",
          contains_pii: true,
          column_source: column_mapping[key],
          allow_null_values: false,
        };
      }
    });

    const filteredCustomConfig = customConfig.filter(
      (config) =>
        config != null &&
        config !== undefined &&
        config.column_name !== `custom_fields`
    );
    dispatch(
      updateTargetsColumnConfig({
        formUID: formUID,
        columnConfig: filteredCustomConfig,
      })
    );
  };

  const findLowestGeoLevel = (locationData: any) => {
    let lowestGeoLevel = null;

    for (const item of locationData) {
      if (
        !lowestGeoLevel ||
        item.parent_geo_level_uid > lowestGeoLevel.parent_geo_level_uid
      ) {
        lowestGeoLevel = item;
      }
    }

    return lowestGeoLevel;
  };

  const fetchSurveyModuleQuestionnaire = async () => {
    if (survey_uid) {
      const moduleQQuestionnaireRes = await dispatch(
        getSurveyModuleQuestionnaire({ survey_uid: survey_uid })
      );
      if (moduleQQuestionnaireRes?.payload?.data?.target_mapping_criteria) {
        if (
          moduleQQuestionnaireRes?.payload?.data?.target_mapping_criteria.includes(
            "Location"
          )
        ) {
          // use lowest geo level for target mapping location
          const locationRes = await dispatch(
            getSurveyLocationGeoLevels({ survey_uid: survey_uid })
          );

          const locationData = locationRes?.payload;

          const lowestGeoLevel = findLowestGeoLevel(locationData);

          if (lowestGeoLevel?.geo_level_name) {
            setLocationDetailsField([
              {
                title: `${lowestGeoLevel.geo_level_name} ID`,
                key: `location_id_column`,
              },
            ]);
          }
        }
      }
    }
  };

  const moveToUpload = () => {
    navigate(`/survey-information/targets/upload/${survey_uid}/${form_uid}`);
  };

  const updateCustomColumns = (value: string) => {
    const formValues = targetMappingForm.getFieldsValue();
    const valuesArray = Object.values(formValues);
    const extraHeaders = csvHeaders.filter((item: any) => {
      return !valuesArray.includes(item);
    });
    setExtraCSVHeader(extraHeaders);
    // Set allow_null as checked (true) by default for new custom columns
    setCheckboxValues((prev: any) => {
      const updated = { ...prev };
      extraHeaders.forEach((header: string) => {
        if (updated[`${header}`] === undefined) {
          updated[`${header}`] = true;
        }
      });
      return updated;
    });
  };

  const handleFormUID = async () => {
    if (form_uid == "" || form_uid == undefined || form_uid == "undefined") {
      try {
        dispatch(setLoading(true));
        const sctoForm = await dispatch(
          getSurveyCTOForm({ survey_uid: survey_uid })
        );
        if (sctoForm?.payload[0]?.form_uid) {
          navigate(
            `/survey-information/targets/upload/${survey_uid}/${sctoForm?.payload[0]?.form_uid}`
          );
        } else {
          message.error("Kindly configure SCTO Form to proceed");
          navigate(`/survey-information/survey-cto-information/${survey_uid}`);
        }
        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setLoading(false));
        console.log("Error fetching sctoForm:", error);
      }
    }
  };

  useEffect(() => {
    //redirect to upload if missing csvHeaders and cannot perform mapping

    if (csvHeaders.length < 1) {
      message.error("csvHeaders not found kindly reupload csv file");
      navigate(`/survey-information/targets/upload/${survey_uid}/${form_uid}`);
    }

    const keysToExclude = [
      ...mandatoryDetailsField.map((item: { key: any }) => item.key),
      ...locationDetailsField.map((item: { key: any }) => item.key),
    ];

    const extraHeaders = csvHeaders.filter(
      (item) => !keysToExclude.includes(item)
    );

    setExtraCSVHeader(extraHeaders);

    handleFormUID();
    fetchSurveyModuleQuestionnaire();
  }, []);

  return (
    <>
      <GlobalStyle />

      <Container surveyPage={true} />
      <HeaderContainer>
        <Title>Targets: Map CSV columns</Title>
      </HeaderContainer>

      {isLoading || quesLoading || locLoading || isSideMenuLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu />
          <TargetsMapFormWrapper>
            {!hasError && !hasWarning ? (
              <>
                <div>
                  <DescriptionText>
                    Select the column from your .csv file that corresponds to
                    each standard field
                  </DescriptionText>
                </div>
                <Form
                  form={targetMappingForm}
                  requiredMark={customRequiredMarker}
                >
                  <div>
                    {mandatoryDetailsField.map((item: any, idx: any) => {
                      return (
                        <Form.Item
                          label={item.title}
                          name={item.key}
                          key={idx}
                          rules={[
                            {
                              required:
                                (item.key === "location_id_column" &&
                                  !moduleQuestionnaire?.target_mapping_criteria.includes(
                                    "Location"
                                  )) ||
                                (item.key === "gender" &&
                                  !moduleQuestionnaire?.target_mapping_criteria.includes(
                                    "Gender"
                                  )) ||
                                (item.key === "language" &&
                                  !moduleQuestionnaire?.target_mapping_criteria.includes(
                                    "Language"
                                  ))
                                  ? false
                                  : true,
                              message: "Kindly select column to map value!",
                            },
                            {
                              validator: async (_, value) => {
                                if (!value) {
                                  return Promise.resolve(); // No need to check if value is empty
                                }
                                const formValues =
                                  targetMappingForm.getFieldsValue();

                                const valuesArray = Object.values(formValues);
                                // Count occurrences of the selected value in the valuesArray
                                const selectedValueCount = valuesArray.filter(
                                  (val) => val === value
                                ).length;

                                // Check if the selected value is contained more than once
                                if (selectedValueCount > 1) {
                                  return Promise.reject(
                                    "Column is already mapped. The same column cannot be mapped twice!"
                                  );
                                }

                                return Promise.resolve();
                              },
                            },
                          ]}
                          labelCol={{ span: 5 }}
                          labelAlign="left"
                        >
                          <Select
                            showSearch={true}
                            allowClear={true}
                            onChange={updateCustomColumns}
                            style={{ width: 180 }}
                            filterOption={true}
                            placeholder="Choose column"
                            options={csvHeaderOptions}
                          />
                        </Form.Item>
                      );
                    })}
                    {locationDetailsField.length > 0 ? (
                      <>
                        {locationDetailsField.map(
                          (
                            item: {
                              title: any;
                              key: any;
                            },
                            idx: any
                          ) => {
                            return (
                              <Form.Item
                                label={item.title}
                                name={item.key}
                                key={idx}
                                required
                                labelCol={{ span: 5 }}
                                labelAlign="left"
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      "Kindly select column to map value!",
                                  },
                                  {
                                    validator: async (_, value) => {
                                      if (!value) {
                                        return Promise.resolve(); // No need to check if value is empty
                                      }
                                      const formValues =
                                        targetMappingForm.getFieldsValue();

                                      const valuesArray =
                                        Object.values(formValues);
                                      // Count occurrences of the selected value in the valuesArray
                                      const selectedValueCount =
                                        valuesArray.filter(
                                          (val) => val === value
                                        ).length;

                                      // Check if the selected value is contained more than once
                                      if (selectedValueCount > 1) {
                                        return Promise.reject(
                                          "Column is already mapped. The same column cannot be mapped twice!"
                                        );
                                      }

                                      return Promise.resolve();
                                    },
                                  },
                                ]}
                              >
                                <Select
                                  showSearch={true}
                                  allowClear={true}
                                  onChange={updateCustomColumns}
                                  style={{ width: 180 }}
                                  filterOption={true}
                                  placeholder="Choose column"
                                  options={csvHeaderOptions}
                                />
                              </Form.Item>
                            );
                          }
                        )}
                      </>
                    ) : null}

                    {customHeader ? (
                      <>
                        <p
                          style={{
                            color: "#434343",
                            fontFamily: "Lato",
                            fontSize: 14,
                            lineHeight: "20px",
                          }}
                        >
                          {`Custom columns: ${extraCSVHeader.length} new custom columns found`}
                        </p>
                        {extraCSVHeader.map((item: any, idx: any) => {
                          return (
                            <Form.Item
                              label={item}
                              name={item}
                              key={idx}
                              labelCol={{ span: 5 }}
                              labelAlign="left"
                            >
                              <Button
                                icon={
                                  customHeaderSelection[item] !== null &&
                                  customHeaderSelection[item] === true ? (
                                    <LikeFilled style={{ color: "green" }} />
                                  ) : (
                                    <LikeOutlined />
                                  )
                                }
                                style={{ borderRadius: 0 }}
                                onClick={() => {
                                  setCustomHeaderSelection((prev: any) => {
                                    return {
                                      ...prev,
                                      [item]: true,
                                    };
                                  });
                                }}
                              >
                                Keep
                              </Button>
                              <Button
                                icon={
                                  customHeaderSelection[item] !== null &&
                                  customHeaderSelection[item] === false ? (
                                    <DislikeFilled style={{ color: "red" }} />
                                  ) : (
                                    <DislikeOutlined />
                                  )
                                }
                                style={{ borderRadius: 0, marginLeft: "10px" }}
                                onClick={() => {
                                  setCustomHeaderSelection((prev: any) => {
                                    return {
                                      ...prev,
                                      [item]: false,
                                    };
                                  });
                                }}
                              >
                                Ignore
                              </Button>
                              {customHeaderSelection[item] !== null &&
                              customHeaderSelection[item] === true ? (
                                <div style={{ display: "inline-block" }}>
                                  <div
                                    style={{
                                      display: "inline-block",
                                      alignItems: "center",
                                      marginLeft: 30,
                                    }}
                                  >
                                    <Checkbox
                                      name={`${item}`}
                                      checked={
                                        checkboxValues?.[`${item}`] !==
                                        undefined
                                          ? checkboxValues?.[`${item}`]
                                          : true
                                      }
                                      onChange={() =>
                                        handleCheckboxChange(`${item}`)
                                      }
                                    >
                                      Allow Null Values
                                    </Checkbox>
                                  </div>
                                </div>
                              ) : null}
                            </Form.Item>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        <HeadingText>
                          Click below to map other columns which are present in
                          your .csv file!
                        </HeadingText>
                        <CustomBtn
                          type="primary"
                          icon={<SelectOutlined />}
                          onClick={() => {
                            setCustomHeader(true);
                            // This is temp code to store custom header selection status
                            const temp: any = {};
                            extraCSVHeader.forEach((item: string, idx: any) => {
                              temp[item] = null;
                            });
                            setCustomHeaderSelection(temp);
                          }}
                        >
                          Map custom columns
                        </CustomBtn>
                      </>
                    )}
                  </div>
                </Form>
                <CustomBtn
                  onClick={handleTargetsUploadMapping}
                  style={{ marginTop: 20 }}
                >
                  Continue
                </CustomBtn>
              </>
            ) : (
              <>
                <div>
                  <Title>Targets</Title>
                  <br />
                  <RowCountBox
                    total={csvRows.length - 1}
                    correct={
                      csvRows.length - 1 - errorCount > 0
                        ? csvRows.length - 1 - errorCount
                        : 0
                    }
                    error={errorCount}
                    warning={0}
                  />
                  <DescriptionContainer>
                    <ol style={{ paddingLeft: "15px" }}>
                      <li>
                        <span style={{ fontWeight: 700 }}>Download</span>: A csv
                        is ready with all the error rows. Use the button below
                        to download the csv.
                      </li>
                      <li>
                        <span style={{ fontWeight: 700 }}>View errors</span>:
                        The table below has the list of all the errors and the
                        corresponding row numbers. The original row numbers are
                        present as a column in the csv. Use this to edit the
                        csv.
                      </li>
                      <li>
                        <span style={{ fontWeight: 700 }}>
                          Correct and upload
                        </span>
                        : Once you are done with corrections, upload the csv
                        again.
                      </li>
                      <li>
                        <span style={{ fontWeight: 700 }}>Manage</span>: The
                        final list of targets is present in a table and that can
                        also be downloaded.
                      </li>
                    </ol>
                  </DescriptionContainer>
                </div>
                <ErrorWarningTable
                  errorList={errorList}
                  warningList={warningList}
                  showErrorTable={hasError}
                  showWarningTable={hasWarning}
                />
                <div style={{ display: "flex" }}>
                  <CSVLink
                    data={[...errorList, ...warningList]}
                    filename={"target-error-list.csv"}
                  >
                    <CustomBtn type="primary" icon={<CloudDownloadOutlined />}>
                      Download rows that caused errors
                    </CustomBtn>
                  </CSVLink>
                  <CustomBtn
                    onClick={moveToUpload}
                    type="primary"
                    icon={<CloudUploadOutlined />}
                    style={{ marginLeft: 35 }}
                  >
                    Reupload CSV
                  </CustomBtn>
                </div>
              </>
            )}
          </TargetsMapFormWrapper>
        </div>
      )}
    </>
  );
}

export default TargetsMap;
