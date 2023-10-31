import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, Col, Row, Select, Form, message } from "antd";
import Header from "../../../components/Header";
import {
  BackArrow,
  BackLink,
  NavWrapper,
  Title,
} from "../../../shared/Nav.styled";
import SideMenu from "../SideMenu";
import {
  ContinueButton,
  FooterWrapper,
  SaveButton,
} from "../../../shared/FooterBar.styled";
import {
  DescriptionContainer,
  DescriptionText,
  TargetsMapFormWrapper,
  ErrorTable,
  HeadingText,
  OptionText,
  WarningTable,
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
import RowCountBox from "../../../components/RowCountBox";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { setLoading } from "../../../redux/targets/targetSlice";
import { getSurveyCTOForm } from "../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { getSurveyModuleQuestionnaire } from "../../../redux/surveyConfig/surveyConfigActions";
import { TargetMapping } from "../../../redux/targets/types";
import {
  postTargetsMapping,
  updateTargetsColumnConfig,
} from "../../../redux/targets/targetActions";
import { getSurveyLocationGeoLevels } from "../../../redux/surveyLocations/surveyLocationsActions";
import { useState, useEffect } from "react";

import { CSVLink } from "react-csv";
import { it } from "mocha";

interface CSVError {
  type: string;
  count: number;
  rows: string;
}
function TargetsMap() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (hasError) {
      return setHasError(false);
    }
    navigate(-1);
  };
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

  const errorTableColumn = [
    {
      title: "Error type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Count of errors",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Rows (in original csv) with error",
      dataIndex: "rows",
      key: "rows",
    },
  ];

  const warningTableColumn = [
    {
      title: "Warning type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Count of warning",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Rows (in original csv) with warning",
      dataIndex: "rows",
      key: "rows",
    },
  ];

  const csvHeaderOptions = csvHeaders.map((item, idx) => {
    return { label: item, value: item };
  });

  const handleTargetsUploadMapping = async () => {
    try {
      //start with an empty error count
      setErrorCount(0);
      const values = await targetMappingForm.validateFields();
      const column_mapping = targetMappingForm.getFieldsValue();
      if (customHeaderSelection) {
        column_mapping.custom_fields = {};
        for (const [column_name, shouldInclude] of Object.entries(
          customHeaderSelection
        )) {
          if (shouldInclude) {
            column_mapping["custom_fields"][column_name] = column_name; // Set the column_type to "custom_fields"
          }
        }
      }

      const requestData: TargetMapping = {
        column_mapping: column_mapping,
        file: csvBase64Data,
        mode: "overwrite",
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

          console.log("errors", mappingsRes?.payload?.errors);

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
          //route to manage
          navigate(
            `/survey-information/targets/manage/${survey_uid}/${form_uid}`
          );
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
      console.log("Form validation error:", error);

      const requiredErrors: any = {};
      const formFields = targetMappingForm.getFieldsValue();

      for (const field in formFields) {
        const errors = targetMappingForm.getFieldError(field);
        if (errors && errors.length > 0) {
          requiredErrors[field] = true;
        }
      }

      console.log("Required errors:", requiredErrors);
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

        console.log("bottom_geo_level_location", key, personal, location);

        if (key === "custom_fields") {
          //loop through the custom fields checking for pii
          const customFields: any = column_mapping[key];

          const fieldsConfig = Object.keys(customFields).map((customKey) => {
            const bulk = checkboxValues?.[`${customKey}_bulk`]
              ? checkboxValues?.[`${customKey}_bulk`]
              : true;
            const pii = checkboxValues?.[`${customKey}_pii`]
              ? checkboxValues?.[`${customKey}_pii`]
              : true;

            return {
              bulk_editable: bulk,
              column_name: customKey,
              column_type: "custom_field",
              contains_pii: pii,
            };
          });

          console.log("fieldsConfig", fieldsConfig);
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

    console.log("filteredCustomConfig", filteredCustomConfig);

    dispatch(
      updateTargetsColumnConfig({
        formUID: formUID,
        columnConfig: filteredCustomConfig,
      })
    );

    console.log(customConfig);
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
      if (
        moduleQQuestionnaireRes?.payload?.data?.supervisor_assignment_criteria
      ) {
        if (
          moduleQQuestionnaireRes?.payload?.data?.supervisor_assignment_criteria.includes(
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

            console.log("locationDetailsField", locationDetailsField);
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
      <Header />
      <NavWrapper>
        <BackLink onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title> {activeSurvey?.survey_name} </Title>
      </NavWrapper>
      {isLoading || quesLoading || locLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu />
          <TargetsMapFormWrapper>
            {!hasError && !hasWarning ? (
              <>
                <div>
                  <Title>Targets: Map CSV columns</Title>
                  <DescriptionText>
                    Select corresponding CSV column for the label on the left
                  </DescriptionText>
                </div>
                <Form form={targetMappingForm}>
                  <div>
                    <HeadingText style={{ marginBottom: 22 }}>
                      Mandatory columns
                    </HeadingText>
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
                                  !moduleQuestionnaire?.supervisor_assignment_criteria.includes(
                                    "Location"
                                  )) ||
                                item.key === "gender" ||
                                item.key === "language"
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
                        <HeadingText>Location ID</HeadingText>
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
                        <HeadingText>Custom columns</HeadingText>
                        <p
                          style={{
                            color: "#434343",
                            fontFamily: "Inter",
                            fontSize: 12,
                            lineHeight: "20px",
                          }}
                        >
                          {extraCSVHeader.length} custom columns found!
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
                                style={{ borderRadius: 0 }}
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
                                      name={`${item}_mandatory`}
                                      checked={
                                        checkboxValues?.[`${item}_mandatory`]
                                          ? checkboxValues?.[
                                              `${item}_mandatory`
                                            ]
                                          : false
                                      }
                                      onChange={() =>
                                        handleCheckboxChange(
                                          `${item}_mandatory`
                                        )
                                      }
                                    >
                                      Is mandatory?
                                    </Checkbox>
                                  </div>
                                  <div
                                    style={{
                                      display: "inline-block",
                                      alignItems: "center",
                                      marginLeft: 30,
                                    }}
                                  >
                                    <Checkbox
                                      name={`${item}_bulk`}
                                      checked={
                                        checkboxValues?.[`${item}_bulk`]
                                          ? checkboxValues?.[`${item}_bulk`]
                                          : false
                                      }
                                      onChange={() =>
                                        handleCheckboxChange(`${item}_bulk`)
                                      }
                                    >
                                      Bulk edit?
                                    </Checkbox>
                                  </div>
                                  <div
                                    style={{
                                      display: "inline-block",
                                      alignItems: "center",
                                      marginLeft: 30,
                                    }}
                                  >
                                    <Checkbox
                                      name={`${item}_pii`}
                                      checked={
                                        checkboxValues?.[`${item}_pii`]
                                          ? checkboxValues?.[`${item}_pii`]
                                          : false
                                      }
                                      onChange={() =>
                                        handleCheckboxChange(`${item}_pii`)
                                      }
                                    >
                                      PII?
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
                          Want to map more columns, which are custom to your
                          survey and present in the csv? Click on the button
                          below after mapping the mandatory columns!
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
                {hasError ? (
                  <div style={{ marginTop: 22 }}>
                    <p
                      style={{
                        fontFamily: "Inter",
                        fontSize: "14px",
                        fontWeight: "700",
                        lineHeight: "22px",
                      }}
                    >
                      Errors table
                    </p>
                    <Row>
                      <Col span={23}>
                        <ErrorTable
                          dataSource={errorList}
                          columns={errorTableColumn}
                          pagination={false}
                        />
                      </Col>
                    </Row>
                  </div>
                ) : null}
                {hasWarning ? (
                  <div>
                    <p
                      style={{
                        fontFamily: "Inter",
                        fontSize: "14px",
                        fontWeight: "700",
                        lineHeight: "22px",
                      }}
                    >
                      Warnings table
                    </p>
                    <Row>
                      <Col span={23}>
                        <WarningTable
                          dataSource={warningList}
                          columns={warningTableColumn}
                          pagination={false}
                        />
                      </Col>
                    </Row>
                  </div>
                ) : null}
                <div style={{ display: "flex" }}>
                  <Button
                    type="primary"
                    icon={<CloudDownloadOutlined />}
                    style={{ backgroundColor: "#2f54eB" }}
                  >
                    Download errors and warnings
                  </Button>
                  <Button
                    onClick={moveToUpload}
                    type="primary"
                    icon={<CloudUploadOutlined />}
                    style={{ marginLeft: 35, backgroundColor: "#2f54eB" }}
                  >
                    Upload corrected CSV
                  </Button>
                </div>
              </>
            )}
          </TargetsMapFormWrapper>
        </div>
      )}
      <FooterWrapper>
        <SaveButton disabled>Save</SaveButton>
        <ContinueButton onClick={handleTargetsUploadMapping}>
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default TargetsMap;
