import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, Col, Form, Row, Select, message } from "antd";
import Header from "../../../../components/Header.OLD";
import {
  BackArrow,
  BackLink,
  NavWrapper,
  Title,
} from "../../../../shared/Nav.styled";
import SideMenu from "../../SideMenu";
import {
  ContinueButton,
  FooterWrapper,
  SaveButton,
} from "../../../../shared/FooterBar.styled";
import {
  DescriptionContainer,
  DescriptionText,
  EnumeratorsMapFormWrapper,
  ErrorTable,
  HeadingText,
  OptionText,
} from "./EnumeratorsMap.styled";
import {
  CloudUploadOutlined,
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import RowCountBox from "../../../../components/RowCountBox";
import { RootState } from "../../../../redux/store";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import {
  postEnumeratorsMapping,
  updateEnumeratorColumnConfig,
} from "../../../../redux/enumerators/enumeratorsActions";
import { EnumeratorMapping } from "../../../../redux/enumerators/types";
import { getSurveyCTOForm } from "../../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { setLoading } from "../../../../redux/enumerators/enumeratorsSlice";
import { getSurveyModuleQuestionnaire } from "../../../../redux/surveyConfig/surveyConfigActions";
import { GlobalStyle } from "../../../../shared/Global.styled";
import HandleBackButton from "../../../../components/HandleBackButton";

interface CSVError {
  type: string;
  count: number;
  rows: string;
}
function EnumeratorsMap() {
  const navigate = useNavigate();

  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };
  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };
  const [enumeratorMappingForm] = Form.useForm();
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [errorList, setErrorList] = useState<CSVError[]>([]);
  const [customHeader, setCustomHeader] = useState<boolean>(false);
  const [customHeaderSelection, setCustomHeaderSelection] = useState<any>({});
  const [locationBatchField, setLocationBatchField] = useState<any>([]);
  const [extraCSVHeader, setExtraCSVHeader] = useState<any>([]);

  const dispatch = useAppDispatch();

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const isLoading = useAppSelector(
    (state: RootState) => state.enumerators.loading
  );

  const quesLoading = useAppSelector(
    (state: RootState) => state.surveyConfig.loading
  );

  const locLoading = useAppSelector(
    (state: RootState) => state.surveyLocations.loading
  );

  const csvHeaders = useAppSelector(
    (state: RootState) => state.enumerators.csvColumnNames
  );

  const csvRows = useAppSelector(
    (state: RootState) => state.enumerators.csvRows
  );

  const csvBase64Data = useAppSelector(
    (state: RootState) => state.enumerators.csvBase64Data
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

  // Mandatory Field
  const personalDetailsField = [
    {
      title: "Enumerator ID",
      key: "enumerator_id",
    },
    {
      title: "Enumerator Name",
      key: "name",
    },
    {
      title: "Email ID",
      key: "email",
    },
    {
      title: "Mobile (primary)",
      key: "mobile_primary",
    },
    {
      title: "Language",
      key: "language",
    },
    {
      title: "Address",
      key: "address",
    },
    {
      title: "Gender",
      key: "gender",
    },
    {
      title: "Enumerator type",
      key: "enumerator_type",
    },
  ];

  const personalBatchField = [
    "enumerator_id",
    "name",
    "email",
    "mobile_primary",
    "address",
    "language",
    "gender",
    "enumerator_type",
  ];
  const bulkEditableFields = ["language", "gender", "enumerator_type"];

  const csvHeaderOptions = csvHeaders.map((item, idx) => {
    return { label: item, value: item };
  });

  const moveToUpload = () => {
    navigate(
      `/survey-information/enumerators/upload/${survey_uid}/${form_uid}`
    );
  };

  const handleFormUID = async (survey_uid: any, form_uid: any) => {
    if (form_uid == "" || form_uid == undefined) {
      try {
        dispatch(setLoading(true));
        const sctoForm = await dispatch(
          getSurveyCTOForm({ survey_uid: survey_uid })
        );
        if (sctoForm?.payload[0]?.form_uid) {
          navigate(
            `/survey-information/enumerators/upload/${survey_uid}/${sctoForm?.payload[0]?.form_uid}`
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
  const fetchSurveyModuleQuestionnaire = async (
    survey_uid: any,
    locationBatchField: any
  ) => {
    if (survey_uid) {
      const moduleQQuestionnaireRes = await dispatch(
        getSurveyModuleQuestionnaire({ survey_uid: survey_uid })
      );
      if (
        moduleQQuestionnaireRes?.payload?.data?.surveyor_mapping_criteria.includes(
          "Location"
        )
      ) {
        setLocationBatchField([...locationBatchField, "location_id_column"]);
      }
    }
  };
  const handleEnumeratorUploadMapping = async () => {
    try {
      //start with an empty error count
      setErrorCount(0);
      const values = await enumeratorMappingForm.validateFields();
      const column_mapping = enumeratorMappingForm.getFieldsValue();
      column_mapping.custom_fields = [];
      if (customHeaderSelection) {
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

      const requestData: EnumeratorMapping = {
        column_mapping: column_mapping,
        file: csvBase64Data,
        mode: "overwrite",
      };

      if (form_uid !== undefined) {
        const mappingsRes = await dispatch(
          postEnumeratorsMapping({
            enumeratorMappingData: requestData,
            formUID: form_uid,
          })
        );

        //set error list
        if (mappingsRes.payload.success === false) {
          message.error(mappingsRes.payload.message);

          if (mappingsRes?.payload?.errors || mappingsRes?.payload?.message) {
            const transformedErrors: CSVError[] = [];

            console.log("mappingsRes.payload", mappingsRes.payload);

            const errorList = mappingsRes.payload.errors
              ? mappingsRes.payload.errors
              : mappingsRes?.payload?.message;

            console.log("errorList", errorList);

            for (const errorKey in errorList) {
              console.log("errorKey", errorKey);
              let errorObj = errorList[errorKey];

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
          message.success("Enumerators uploaded and mapped successfully.");

          //auto configure columns for users setting personal as non_batch and the rest as batch
          //use the column mapping to do this

          const flattenedColumnMapping = {
            ...column_mapping,
            ...column_mapping.custom_fields,
          };
          delete flattenedColumnMapping.custom_fields;

          const customConfig = Object.keys(flattenedColumnMapping).map(
            (key) => {
              if (key && flattenedColumnMapping[key] !== undefined) {
                const personal = personalBatchField.includes(key);
                const location = locationBatchField.includes(key);
                const bulkEditable = bulkEditableFields.includes(key);
                return {
                  bulk_editable: bulkEditable ? true : location ? true : false,
                  column_name: key,
                  column_type: personal
                    ? "personal_details"
                    : location
                    ? "location"
                    : "custom_fields",
                };
              }
            }
          );

          const filteredCustomConfig = customConfig.filter(
            (config: any) =>
              config != null &&
              config !== undefined &&
              config.column_name !== `custom_fields`
          );

          dispatch(
            updateEnumeratorColumnConfig({
              formUID: form_uid,
              columnConfig: filteredCustomConfig,
            })
          );

          setHasError(false);
          //route to home
          navigate(`/survey-information/enumerators/${survey_uid}/${form_uid}`);
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
      console.log("error", error);
      message.error("Failed to upload kindly check and try again");
      setHasError(true);

      const requiredErrors: any = {};
      const formFields = enumeratorMappingForm.getFieldsValue();

      for (const field in formFields) {
        const errors = enumeratorMappingForm.getFieldError(field);
        if (errors && errors.length > 0) {
          requiredErrors[field] = true;
        }
      }
    }
  };

  const updateCustomColumns = (value: string) => {
    const formValues = enumeratorMappingForm.getFieldsValue();

    const valuesArray = Object.values(formValues);

    const extraHeaders = csvHeaders.filter((item: any) => {
      return !valuesArray.includes(item);
    });

    setExtraCSVHeader(extraHeaders);
  };

  useEffect(() => {
    //redirect to upload if missing csvHeaders and cannot perform mapping
    if (csvHeaders.length < 1) {
      message.error("csvHeaders not found kindly reupload csv file");
      navigate(
        `/survey-information/enumerators/upload/${survey_uid}/${form_uid}`
      );
    }

    const keysToExclude = [...personalDetailsField.map((item) => item.key)];

    const extraHeaders = csvHeaders.filter(
      (item) => !keysToExclude.includes(item)
    );

    setExtraCSVHeader(extraHeaders);
    handleFormUID(survey_uid, form_uid);
    fetchSurveyModuleQuestionnaire(survey_uid, locationBatchField);
  }, []);

  return (
    <>
      <GlobalStyle />
      {/* <Header /> */}
      <NavWrapper>
        <HandleBackButton surveyPage={true}></HandleBackButton>

        <Title>
          {(() => {
            const activeSurveyData = localStorage.getItem("activeSurvey");
            return (
              activeSurvey?.survey_name ||
              (activeSurveyData && JSON.parse(activeSurveyData).survey_name) ||
              ""
            );
          })()}
        </Title>
      </NavWrapper>
      {isLoading || quesLoading || locLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu />
          <EnumeratorsMapFormWrapper>
            {!hasError ? (
              <>
                <div>
                  <Title>Enumerators: Map CSV columns</Title>
                  <DescriptionText>
                    Select corresponding CSV column for the label on the left
                  </DescriptionText>
                </div>
                <Form form={enumeratorMappingForm}>
                  <div>
                    <HeadingText style={{ marginBottom: 22 }}>
                      Mandatory columns
                    </HeadingText>
                    <HeadingText>Personal and contact details</HeadingText>
                    {personalDetailsField.map((item, idx) => {
                      return (
                        <Form.Item
                          label={item.title}
                          name={item.key}
                          key={idx}
                          rules={[
                            {
                              required:
                                (item.key === "language" &&
                                  !moduleQuestionnaire?.surveyor_mapping_criteria.includes(
                                    "Language"
                                  )) ||
                                item.key === "home_address"
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
                                  enumeratorMappingForm.getFieldsValue();

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
                    {locationBatchField.length > 0 ? (
                      <>
                        <HeadingText>Location ID</HeadingText>

                        <Form.Item
                          label="Prime geo location:"
                          name="location_id_column"
                          key="location_id_column"
                          required
                          labelAlign="left"
                          labelCol={{ span: 5 }}
                          rules={[
                            {
                              required: true,
                              message: "Kindly select column to map value!",
                            },
                            {
                              validator: async (_, value) => {
                                if (!value) {
                                  return Promise.resolve(); // No need to check if value is empty
                                }
                                const formValues =
                                  enumeratorMappingForm.getFieldsValue();

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
                      </>
                    ) : null}

                    {customHeader ? (
                      <>
                        <HeadingText>Custom columns</HeadingText>
                        <p
                          style={{
                            color: "#434343",
                            fontFamily: "Lato",
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
                  <Title>Enumerators</Title>
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
                        final list of enumerators is present in a table and that
                        can also be downloaded.
                      </li>
                    </ol>
                  </DescriptionContainer>
                </div>
                {errorList !== null && (
                  <div style={{ marginTop: 22 }}>
                    <p
                      style={{
                        fontFamily: "Lato",
                        fontSize: "14px",
                        fontWeight: "700",
                        lineHeight: "22px",
                      }}
                    >
                      Errors and warnings table
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
                )}

                <div style={{ display: "flex" }}>
                  <Button
                    onClick={moveToUpload}
                    type="primary"
                    icon={<CloudUploadOutlined />}
                    style={{ backgroundColor: "#2f54eB" }}
                  >
                    Upload CSV again
                  </Button>
                </div>
              </>
            )}
          </EnumeratorsMapFormWrapper>
        </div>
      )}
      <FooterWrapper>
        <SaveButton disabled>Save</SaveButton>
        <ContinueButton onClick={handleEnumeratorUploadMapping}>
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default EnumeratorsMap;
