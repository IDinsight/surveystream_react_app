import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, Col, Form, Row, Select, message } from "antd";
import {
  DescriptionContainer,
  EnumeratorsRemapFormWrapper,
  ErrorTable,
  HeadingText,
  StyledBreadcrumb,
} from "./EnumeratorsRemap.styled";
import { Title } from "../../../../shared/Nav.styled";
import { CustomBtn, DescriptionText } from "../../../../shared/Global.styled";
import { RootState } from "../../../../redux/store";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { postEnumeratorsMapping } from "../../../../redux/enumerators/enumeratorsActions";
import { EnumeratorMapping } from "../../../../redux/enumerators/types";
import {
  CloseOutlined,
  LikeFilled,
  LikeOutlined,
  DislikeFilled,
  DislikeOutlined,
  SelectOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import RowCountBox from "../../../../components/RowCountBox";
import { getSurveyModuleQuestionnaire } from "../../../../redux/surveyConfig/surveyConfigActions";
import {
  setLoading,
  setMappingErrorCount,
  setMappingErrorList,
  setMappingErrorStatus,
} from "../../../../redux/enumerators/enumeratorsSlice";
import { getSurveyCTOForm } from "../../../../redux/surveyCTOInformation/surveyCTOInformationActions";

import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { GlobalStyle } from "../../../../shared/Global.styled";
import { resolveSurveyNotification } from "../../../../redux/notifications/notificationActions";
import { validateCSVData } from "../../../../utils/csvValidator";
import { CSVLink } from "react-csv";

interface CSVError {
  type: string;
  count: number;
  rows: string;
}

interface IEnumeratorsReupload {
  setScreenMode: Dispatch<SetStateAction<string>>;
}

function EnumeratorsRemap({ setScreenMode }: IEnumeratorsReupload) {
  const navigate = useNavigate();

  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };
  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };

  const [enumeratorMappingForm] = Form.useForm();
  const [customHeader, setCustomHeader] = useState<boolean>(false);
  const [customHeaderSelection, setCustomHeaderSelection] = useState<any>({});
  const [locationBatchField, setLocationBatchField] = useState<any>([]);
  const [extraCSVHeader, setExtraCSVHeader] = useState<any>([]);

  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(
    (state: RootState) => state.enumerators.loading
  );

  const quesLoading = useAppSelector(
    (state: RootState) => state.surveyConfig.loading
  );

  const locLoading = useAppSelector(
    (state: RootState) => state.surveyLocations.loading
  );

  const enumeratorColumnMapping = useAppSelector(
    (state: RootState) => state.enumerators.enumeratorColumnMapping
  );

  const mappingErrorStatus = useAppSelector(
    (state: RootState) => state.enumerators.mappingErrorStatus
  );

  const mappingErrorList = useAppSelector(
    (state: RootState) => state.enumerators.mappingErrorList
  );

  const mappingErrorCount = useAppSelector(
    (state: RootState) => state.enumerators.mappingErrorCount
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

  const [checkboxValues, setCheckboxValues] = useState<any>();
  const handleCheckboxChange = (name: any) => {
    setCheckboxValues((prevValues: { [x: string]: any }) => ({
      ...prevValues,
      [name]: prevValues?.[name] ? !prevValues?.[name] : true,
    }));
  };

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
      key: "home_address",
    },
    {
      title: "Gender",
      key: "gender",
    },
    {
      title: "Enumerator Type",
      key: "enumerator_type",
    },
  ];

  const personalBatchField = [
    "enumerator_id",
    "name",
    "email",
    "mobile_primary",
    "home_address",
  ];

  const csvHeaderOptions = csvHeaders.map((item) => {
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
  const moveToUpload = () => {
    dispatch(setMappingErrorStatus(false));
    setScreenMode("reupload");
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

  const updateCustomColumns = (value: any) => {
    const formValues = enumeratorMappingForm.getFieldsValue();

    const valuesArray = Object.values(formValues);

    const extraHeaders = csvHeaders.filter((item: any) => {
      return !valuesArray.includes(item);
    });

    setExtraCSVHeader(extraHeaders);
  };

  const handleEnumeratorUploadMapping = async () => {
    try {
      //start with an empty error count
      dispatch(setMappingErrorCount(0));
      const values = await enumeratorMappingForm.validateFields();
      const column_mapping = enumeratorMappingForm.getFieldsValue();
      column_mapping.custom_fields = [];
      if (customHeaderSelection) {
        const mappedValues = Object.values(column_mapping);
        for (const [column_name, shouldInclude] of Object.entries(
          customHeaderSelection
        )) {
          // Only add to custom_fields if:
          // 1. It's marked for inclusion (shouldInclude is true)
          // 2. It's not already mapped to another field
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
        ...personalDetailsField
          .filter((item) => item.key !== "home_address")
          .map((item: any) => column_mapping[item.key])
          .filter(Boolean),

        // Add all location fields
        ...locationBatchField
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

      const requestData: EnumeratorMapping = {
        column_mapping: column_mapping,
        file: csvBase64Data,
        mode: "merge",
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
          message.success("Enumerators uploaded and mapped successfully.");

          //auto configure columns for users setting personal as non_batch and the rest as batch
          //use the column mapping to do this
          //TODO: add column config here if needed on merge

          dispatch(setMappingErrorStatus(false));

          // Set any unresolved enumerator notifications to resolved
          dispatch(
            resolveSurveyNotification({
              survey_uid: survey_uid,
              module_id: 7,
              resolution_status: "done",
            })
          );

          //route to home
          setScreenMode("manage");
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
      const formFields = enumeratorMappingForm.getFieldsValue();

      for (const field in formFields) {
        const errors = enumeratorMappingForm.getFieldError(field);
        if (errors && errors.length > 0) {
          requiredErrors[field] = true;
        }
      }
    }
  };

  const fetchSurveyModuleQuestionnaire = async () => {
    // Only fetch module questionnaire if not already loaded
    if (
      survey_uid &&
      moduleQuestionnaire?.surveyor_mapping_criteria &&
      moduleQuestionnaire?.surveyor_mapping_criteria?.includes("Location") &&
      locationBatchField.length === 0
    ) {
      setLocationBatchField([...locationBatchField, "location_id_column"]);
      return;
    }
    if (survey_uid && !moduleQuestionnaire?.surveyor_mapping_criteria) {
      const moduleQQuestionnaireRes = await dispatch(
        getSurveyModuleQuestionnaire({ survey_uid })
      );

      // Update location batch field if criteria includes Location
      if (
        moduleQQuestionnaireRes?.payload?.data?.surveyor_mapping_criteria?.includes(
          "Location"
        ) &&
        locationBatchField.length === 0
      ) {
        setLocationBatchField([...locationBatchField, "location_id_column"]);
      }
      return;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Handle CSV headers validation if not already done
        if (csvHeaders.length < 1) {
          message.error("csvHeaders not found; kindly reupload the CSV file");
          navigate(`/survey-information/enumerators/${survey_uid}/${form_uid}`);
          return;
        }

        // Only initialize form if enumeratorColumnMapping exists and form is empty
        const currentFormValues = enumeratorMappingForm.getFieldsValue();
        if (
          enumeratorColumnMapping &&
          Object.keys(currentFormValues).length === 0
        ) {
          enumeratorMappingForm.setFieldsValue({ ...enumeratorColumnMapping });
        }

        // Only update extra CSV headers if not already set
        if (extraCSVHeader.length === 0) {
          const keysToExclude = [
            ...personalDetailsField.map((item) => item.key),
            ...locationBatchField,
          ];

          const extraHeaders = csvHeaders.filter(
            (item) => !keysToExclude.includes(item)
          );

          setExtraCSVHeader(extraHeaders);
        }
        await fetchSurveyModuleQuestionnaire();

        // Handle form UID if not already done
        if (!form_uid) {
          await handleFormUID(survey_uid, form_uid);
        }
      } catch (error) {
        console.error("Error in initialization:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <GlobalStyle />
      <EnumeratorsRemapFormWrapper>
        <div style={{ display: "flex" }}>
          <Title>Add new enumerators</Title>
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
        {isLoading || quesLoading || locLoading ? (
          <FullScreenLoader />
        ) : (
          <div>
            {!mappingErrorStatus ? (
              <>
                <div>
                  <DescriptionText>
                    Select the column from your .csv file that corresponds to
                    each standard field{" "}
                  </DescriptionText>
                </div>
                <Form
                  form={enumeratorMappingForm}
                  requiredMark={customRequiredMarker}
                >
                  <div>
                    {personalDetailsField.map((item, idx) => {
                      return (
                        <Form.Item
                          label={item.title}
                          name={item.key}
                          key={idx}
                          rules={[
                            {
                              required:
                                item.key === "home_address" ? false : true,
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
                            onChange={(value: any) => {
                              updateCustomColumns(value); // Manually call the function
                            }}
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
                        <Form.Item
                          label="Prime Geo Location:"
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
                              <Checkbox
                                style={{ marginLeft: 10 }}
                                name={`${item}_allow_null`}
                                checked={
                                  checkboxValues?.[`${item}_allow_null`]
                                    ? checkboxValues?.[`${item}_allow_null`]
                                    : false
                                }
                                onChange={() =>
                                  handleCheckboxChange(`${item}_allow_null`)
                                }
                              >
                                Accept null values
                              </Checkbox>
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
                            extraCSVHeader.forEach((item: string) => {
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
                  onClick={handleEnumeratorUploadMapping}
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
                      { title: "Upload csv" },
                      { title: "Map csv columns" },
                      { title: "Update enumerators", className: "active" },
                    ]}
                  />
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
                        final list of enumerators is present in a table and that
                        can also be downloaded.
                      </li>
                    </ol>
                  </DescriptionContainer>
                </div>
                {mappingErrorList !== null && (
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
                          dataSource={mappingErrorList}
                          columns={errorTableColumn}
                          pagination={false}
                        />
                      </Col>
                    </Row>
                  </div>
                )}
                <div style={{ display: "flex" }}>
                  <CSVLink
                    data={[...mappingErrorList]}
                    filename={"enumerator-error-list.csv"}
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
      </EnumeratorsRemapFormWrapper>
    </>
  );
}

export default EnumeratorsRemap;
