import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button, Checkbox, Col, Row, Select, Form, message, Alert } from "antd";
import { Title } from "../../../../shared/Nav.styled";
import {
  DescriptionContainer,
  HeadingText,
  TargetsRemapFormWrapper,
  DescriptionText,
} from "./TargetsRemap.styled";
import {
  CloseOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import RowCountBox from "../../../../components/RowCountBox";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import {
  setLoading,
  setMappingErrorList,
  setMappingErrorStatus,
  setMappingErrorCount,
} from "../../../../redux/targets/targetSlice";
import { getSurveyCTOForm } from "../../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { getSurveyModuleQuestionnaire } from "../../../../redux/surveyConfig/surveyConfigActions";
import { TargetMapping } from "../../../../redux/targets/types";
import {
  postTargetsMapping,
  updateTargetsColumnConfig,
} from "../../../../redux/targets/targetActions";
import { getSurveyLocationGeoLevels } from "../../../../redux/surveyLocations/surveyLocationsActions";

import { CSVLink } from "react-csv";
import { StyledBreadcrumb } from "../TargetsReupload/TargetsReupload.styled";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { CustomBtn, GlobalStyle } from "../../../../shared/Global.styled";
import { resolveSurveyNotification } from "../../../../redux/notifications/notificationActions";
import ErrorWarningTable from "../../../../components/ErrorWarningTable";
import { validateCSVData } from "../../../../utils/csvValidator";

interface CSVError {
  type: string;
  count: number;
  rows: string;
}

interface ITargetsRemap {
  setScreenMode: Dispatch<SetStateAction<string>>;
}

function TargetsRemap({ setScreenMode }: ITargetsRemap) {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };
  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };

  const [targetMappingForm] = Form.useForm();
  const [hasWarning, setHasWarning] = useState<boolean>(false);
  const [warningList, setWarningList] = useState<CSVError[]>([]);
  const [customHeader, setCustomHeader] = useState<boolean>(false);
  const [customHeaderSelection, setCustomHeaderSelection] = useState<any>({});
  const [checkboxValues, setCheckboxValues] = useState<any>();
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

  const mappingErrorStatus = useAppSelector(
    (state: RootState) => state.targets.mappingErrorStatus
  );

  const mappingErrorList = useAppSelector(
    (state: RootState) => state.targets.mappingErrorList
  );

  const mappingErrorCount = useAppSelector(
    (state: RootState) => state.targets.mappingErrorCount
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
  const targetsColumnMapping = useAppSelector(
    (state: RootState) => state.targets.targetsColumnMapping
  );

  const csvHeaderOptions = csvHeaders.map((item, idx) => {
    return { label: item, value: item };
  });

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

  const handleTargetsUploadMapping = async () => {
    try {
      dispatch(setMappingErrorCount(0));
      const values = await targetMappingForm.validateFields();
      const column_mapping = targetMappingForm.getFieldsValue();
      if (customHeaderSelection) {
        column_mapping.custom_fields = [];
        for (const [column_name, shouldInclude] of Object.entries(
          customHeaderSelection
        )) {
          if (shouldInclude) {
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
          .filter(
            (field: any) => !checkboxValues?.[`${field.column_name}_allow_null`]
          )
          .map((field: any) => field.column_name),
      ];
      // Validate CSV for empty columns (only for columnsToCheck)
      if (columnsToCheck.length > 0) {
        const validationResult = await validateCSVData(
          new File([atob(csvBase64Data)], "data.csv"),
          true,
          columnsToCheck
        );
        console.log(columnsToCheck, validationResult);
        if (
          validationResult &&
          "isValid" in validationResult &&
          validationResult.isValid === false &&
          validationResult.inValidData?.length > 0
        ) {
          dispatch(setMappingErrorStatus(true));
          dispatch(
            setMappingErrorList(
              (validationResult.inValidData as string[]).map((msg) => ({
                type: "Validation Error",
                count: 1,
                rows: msg,
              }))
            )
          );
          dispatch(setMappingErrorCount(csvRows.length - 1));
          message.error(
            "Empty values found in required columns. Please fix and try again."
          );
          return;
        }
      }

      const requestData: TargetMapping = {
        column_mapping: column_mapping,
        file: csvBase64Data,
        mode: "merge",
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

              dispatch(
                setMappingErrorCount(
                  mappingsRes.payload.errors[errorKey]["summary"]
                    ? mappingsRes.payload.errors[errorKey]["summary"][
                        "error_count"
                      ]
                    : mappingErrorCount + errorObj.length
                )
              );
            }
            if (mappingErrorCount >= csvRows.length) {
              dispatch(setMappingErrorCount(csvRows.length - 1));
            }
            dispatch(setMappingErrorList(transformedErrors));
          }
          dispatch(setMappingErrorStatus(true));
          return;
        }

        if (mappingsRes.payload.success) {
          message.success("Targets uploaded and mapped successfully.");

          handleTargetColumnConfig(form_uid, column_mapping);

          dispatch(setMappingErrorStatus(false));

          // Set any unresolved target notifications to resolved
          dispatch(
            resolveSurveyNotification({
              survey_uid: survey_uid,
              module_id: 8,
              resolution_status: "done",
            })
          );

          //route to manage
          setScreenMode("manage");
          navigate(`/survey-information/targets/${survey_uid}/${form_uid}`);
        } else {
          message.error("Failed to upload kindly check and try again");
          dispatch(setMappingErrorStatus(true));
        }
      } else {
        message.error(
          "Kindly check that form_uid is provided in the url to proceed."
        );
        dispatch(setMappingErrorStatus(true));
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

  const handleCheckboxChange = (name: any) => {
    setCheckboxValues((prevValues: { [x: string]: any }) => ({
      ...prevValues,
      [name]: prevValues?.[name] ? prevValues?.[name] : true,
    }));
  };

  const handleTargetColumnConfig = async (
    formUID: any,
    column_mapping: any
  ) => {
    //auto configure columns for users setting personal as non_batch and the rest as batch
    //use the column mapping to do this

    const customConfig = Object.keys(column_mapping).map((key) => {
      if (key !== null && key !== "" && key !== undefined) {
        const personal = ["target_id"].includes(key);
        const custom = ["gender", "language"].includes(key);

        const location =
          locationDetailsField.includes(key) ||
          ["location_id_column"].includes(key);

        if (key === "custom_fields") {
          //loop through the custom fields checking for pii
          const customFields: any = column_mapping[key];

          const fieldsConfig = Object.keys(customFields).map((customKey) => {
            const columnName = column_mapping[key][customKey]["column_name"];

            return {
              column_name: columnName,
              column_type: "custom_field",
              column_source: columnName,
            };
          });
        }

        return {
          bulk_editable: personal
            ? false
            : location
            ? true
            : custom
            ? true
            : true,
          column_name:
            key == "location_id_column" ? "bottom_geo_level_location" : key,
          column_type:
            personal || custom
              ? "basic_details"
              : location
              ? "location"
              : "custom_field",
          contains_pii: true, //TODO: fix
          column_source: column_mapping[key],
        };
      }
    });

    //TODO: check for custom fields : fix
    const filteredCustomConfig = customConfig.filter(
      (config: any) =>
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
    // Return null if locationData is not an array or is empty
    if (!Array.isArray(locationData) || locationData.length === 0) {
      return null;
    }

    // Create a map to store parent-child relationships
    const parentChildMap = new Map();
    locationData.forEach((level) => {
      parentChildMap.set(level.geo_level_uid, level);
    });

    // Find the level that is not a parent to any other level
    const lowestLevel = locationData.find(
      (level) =>
        !locationData.some(
          (otherLevel) =>
            otherLevel.parent_geo_level_uid === level.geo_level_uid
        )
    );

    return lowestLevel || null;
  };

  const moveToUpload = () => {
    dispatch(setMappingErrorStatus(false));
    setScreenMode("reupload");
  };

  const updateCustomColumns = (value: string) => {
    const formValues = targetMappingForm.getFieldsValue();

    const valuesArray = Object.values(formValues);

    const extraHeaders = csvHeaders.filter((item: any) => {
      return !valuesArray.includes(item);
    });

    setExtraCSVHeader(extraHeaders);
  };

  const fetchModuleQuestionnaire = async () => {
    // Only fetch module questionnaire if not already loaded
    if (survey_uid && !moduleQuestionnaire?.target_mapping_criteria) {
      const moduleQQuestionnaireRes = await dispatch(
        getSurveyModuleQuestionnaire({ survey_uid })
      );

      // Only fetch location data if criteria includes Location and locationDetailsField is empty
      if (
        moduleQQuestionnaireRes?.payload?.data?.target_mapping_criteria?.includes(
          "Location"
        ) &&
        locationDetailsField.length === 0
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
      return;
    }
    if (survey_uid && moduleQuestionnaire.target_mapping_criteria) {
      if (
        moduleQuestionnaire.target_mapping_criteria.includes("Location") &&
        locationDetailsField.length === 0
      ) {
        // use lowest geo level for target mapping location
        const locationRes = await dispatch(
          getSurveyLocationGeoLevels({ survey_uid: survey_uid })
        );

        const locationData = locationRes?.payload;
        console.log("Location data for target mapping:", locationData);

        const lowestGeoLevel = findLowestGeoLevel(locationData);
        console.log(
          "Lowest geo level for target mapping location:",
          lowestGeoLevel
        );

        if (lowestGeoLevel?.geo_level_name) {
          setLocationDetailsField([
            {
              title: `${lowestGeoLevel.geo_level_name} ID`,
              key: `location_id_column`,
            },
          ]);
        }
      }

      return;
    }
  };
  // Replace all the useEffect blocks with this single consolidated effect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Handle CSV headers validation if not already done
        if (csvHeaders.length < 1) {
          message.error("csvHeaders not found; kindly reupload the CSV file");
          navigate(`/survey-information/targets/${survey_uid}/${form_uid}`);
          return;
        }

        // Only initialize form if targetsColumnMapping exists and form is empty
        const currentFormValues = targetMappingForm.getFieldsValue();
        if (
          targetsColumnMapping &&
          Object.keys(currentFormValues).length === 0
        ) {
          targetMappingForm.setFieldsValue({ ...targetsColumnMapping });
        }

        await fetchModuleQuestionnaire();
        // Only update extra CSV headers if not already set
        if (!extraCSVHeader) {
          const keysToExclude = [
            ...mandatoryDetailsField.map((item: { key: any }) => item.key),
            ...locationDetailsField.map((item: { key: any }) => item.key),
          ];

          const extraHeaders = csvHeaders.filter(
            (item) => !keysToExclude.includes(item)
          );

          setExtraCSVHeader(extraHeaders);
        }
      } catch (error) {
        console.error("Error in initialization:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <GlobalStyle />
      <TargetsRemapFormWrapper>
        <div style={{ display: "flex" }}>
          <Button
            style={{
              marginLeft: "auto",
              marginRight: 48,
            }}
            onClick={() => setScreenMode("manage")}
          >
            <CloseOutlined /> Cancel
          </Button>
        </div>
        {isLoading || quesLoading || locLoading || isSideMenuLoading ? (
          <FullScreenLoader />
        ) : (
          <div>
            {!mappingErrorStatus && !hasWarning ? (
              <>
                <div>
                  <DescriptionText>
                    Select the column from your .csv file that corresponds to
                    each standard field{" "}
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
                                      name={`${item}_allow_null`}
                                      checked={
                                        checkboxValues?.[`${item}_allow_null`]
                                          ? checkboxValues?.[
                                              `${item}_allow_null`
                                            ]
                                          : false
                                      }
                                      onChange={() =>
                                        handleCheckboxChange(
                                          `${item}_allow_null`
                                        )
                                      }
                                    >
                                      Allow null values?
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
                        <Button
                          type="primary"
                          icon={<SelectOutlined />}
                          style={{ backgroundColor: "#2f54eB" }}
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
                        </Button>
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
                  <StyledBreadcrumb
                    separator=">"
                    items={[
                      { title: "Upload CSV" },
                      { title: "Map CSV Columns" },
                      { title: "Update Targets", className: "active" },
                    ]}
                  />
                  <br />
                  <RowCountBox
                    total={csvRows.length - 1}
                    correct={
                      csvRows.length - 1 - mappingErrorCount > 0
                        ? csvRows.length - 1 - mappingErrorCount
                        : 0
                    }
                    error={mappingErrorCount}
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
                  errorList={mappingErrorList}
                  warningList={warningList}
                  showErrorTable={mappingErrorStatus}
                  showWarningTable={hasWarning}
                />
                <div style={{ display: "flex" }}>
                  <CSVLink
                    data={[...mappingErrorList, ...warningList]}
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
          </div>
        )}
      </TargetsRemapFormWrapper>
    </>
  );
}

export default TargetsRemap;
