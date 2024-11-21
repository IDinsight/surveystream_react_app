import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Row, Select, Form, message, Tag } from "antd";

import { NavWrapper, Title } from "../../../../shared/Nav.styled";
import SideMenu from "../../SideMenu";
import { TargetMapping } from "../../../../redux/targets/types";
import RowCountBox from "../../../../components/RowCountBox";

import {
  ContinueButton,
  FooterWrapper,
  SaveButton,
} from "../../../../shared/FooterBar.styled";
import {
  DescriptionContainer,
  DescriptionText,
  ErrorTable,
  HeadingText,
  WarningTable,
  TargetsSctoMapFormWrapper,
} from "./TargetsSctoMap.styled";
import {
  SelectOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import { CSVLink } from "react-csv";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import { setLoading } from "../../../../redux/targets/targetSlice";
import { getSurveyCTOForm } from "../../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { getSurveyModuleQuestionnaire } from "../../../../redux/surveyConfig/surveyConfigActions";
import {
  updateTargetsColumnConfig,
  getTargetSCTOColumns,
  getTargetsColumnConfig,
  getTargetConfig,
  postTargetsMapping,
} from "../../../../redux/targets/targetActions";
import { getSurveyLocationGeoLevels } from "../../../../redux/surveyLocations/surveyLocationsActions";
import { useState, useEffect } from "react";

import { GlobalStyle } from "../../../../shared/Global.styled";
import HandleBackButton from "../../../../components/HandleBackButton";
import DynamicTargetFilter from "../../../../components/DynamicTargetFilter";

interface CSVError {
  type: string;
  count: number;
  rows: string;
}
function TargetsSctoMap() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };
  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };

  const [targetMappingForm] = Form.useForm();

  const [customHeader, setCustomHeader] = useState<boolean>(false);
  const [customHeaderSelection, setCustomHeaderSelection] = useState<any>({});
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

  const [csvHeaders, setCSVHeaders] = useState<any>([]);

  const moduleQuestionnaire = useAppSelector(
    (state: RootState) => state.surveyConfig.moduleQuestionnaire
  );

  const [csvHeaderOptions, setCSVHeadersOptions] = useState<any>([]);
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

  const moveToMapping = () => {
    navigate(`/survey-information/targets/scto_map/${survey_uid}/${form_uid}`);
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
              : "custom_fields",
          contains_pii: true, // TODO: fix
          column_source: column_mapping[key],
        };
      }
    });

    // Unwrap all custom fields

    const custom_columns = column_mapping["custom_columns"];
    if (custom_columns && Array.isArray(custom_columns)) {
      custom_columns.forEach((column) => {
        customConfig.push({
          bulk_editable: true,
          column_name: column,
          column_type: "custom_fields",
          contains_pii: true,
          column_source: column,
        });
      });
    }
    const filteredCustomConfig = customConfig.filter(
      (config) =>
        config != null &&
        config !== undefined &&
        config.column_name !== `custom_columns`
    );

    const update_response = await dispatch(
      updateTargetsColumnConfig({
        formUID: formUID,
        columnConfig: filteredCustomConfig,
        filters: inputFilterList,
      })
    );
    if (update_response?.payload?.data?.status === "success") {
      navigate(
        `/survey-information/survey-cto-questions/${survey_uid}/${formUID}`
      );
    } else {
      message.error("Error updating column configuration");
    }
  };

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [inputFilterList, setInputFilterList] = useState<any[]>([]);

  const csvRows = useAppSelector((state: RootState) => state.targets.csvRows);

  const [hasError, setHasError] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);

  const [errorList, setErrorList] = useState<CSVError[]>([]);
  const [hasWarning, setHasWarning] = useState<boolean>(false);
  const [warningList, setWarningList] = useState<CSVError[]>([]);

  const handleTargetsUploadMapping = async (column_mapping: any) => {
    setLoading(true);
    try {
      //start with an empty error count
      setErrorCount(0);
      if (customHeaderSelection) {
        column_mapping.custom_fields = [];
        for (const [column_name, shouldInclude] of Object.entries(
          customHeaderSelection
        )) {
          if (shouldInclude) {
            // Set the column_type to "custom_fields"
            column_mapping.custom_fields.push({
              column_name: column_name,
              field_label: column_name,
            });
          }
        }
      }

      const requestData: TargetMapping = {
        column_mapping: column_mapping,
        file: "   ",
        mode: "overwrite",
        load_from_scto: true,
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
    setLoading(false);
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
          fetchTargetConfig(form_uid);
        } else {
          message.error("Kindly configure SCTO Form to proceed");
          navigate(`/survey-information/survey-cto-information/${survey_uid}`);
        }
        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setLoading(false));
      }
    }
  };

  const fetchCSVHeaders = async () => {
    if (form_uid) {
      try {
        const response = await dispatch(getTargetSCTOColumns({ form_uid }));
        setCSVHeaders(response?.payload?.data?.data);
        setCSVHeadersOptions(
          response?.payload?.data?.data.map((item: string) => {
            return { value: item, label: item };
          })
        );
      } catch (error) {
        console.log("Error fetching input headers:", error);
      }
    } else {
      console.log("form_uid is undefined");
    }
  };

  const fetchTargetColumnConfig = async () => {
    if (form_uid) {
      try {
        const response = await dispatch(
          getTargetsColumnConfig({ formUID: form_uid })
        );
        const columnConfig = response?.payload?.data?.data.file_columns;
        const columnMapping: any = {};
        columnConfig.forEach((config: any) => {
          if (config.column_name === "bottom_geo_level_location") {
            columnMapping["location_id_column"] = config.column_source;
          } else if (config.column_type === "custom_fields") {
            setCustomHeader(true);
            columnMapping["custom_columns"] = columnMapping["custom_columns"]
              ? [...columnMapping["custom_columns"], config.column_source]
              : [config.column_source];
          } else {
            columnMapping[config.column_name] = config.column_source;
          }
        });

        targetMappingForm.setFieldsValue(columnMapping);
      } catch (error) {
        console.log("Error fetching input headers:", error);
      }
    } else {
      console.log("form_uid is undefined");
    }
  };

  const fetchTargetConfig = async (form_uid: any) => {
    setLoading(true);
    const response = await dispatch(getTargetConfig({ form_uid: form_uid! }));
    if (response.payload.success) {
      const configData = response.payload.data.data;
      if (configData.target_source === "csv") {
        navigate(
          `/survey-information/targets/upload/${survey_uid}/${form_uid}`
        );
      }
    }
    setLoading(false);
  };

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
  useEffect(() => {
    // fetch csv headers
    if (form_uid == "" || form_uid == undefined || form_uid == "undefined") {
      handleFormUID();
    }
    fetchCSVHeaders();

    const keysToExclude = [
      ...mandatoryDetailsField.map((item: { key: any }) => item.key),
      ...locationDetailsField.map((item: { key: any }) => item.key),
    ];

    const extraHeaders = csvHeaders.filter(
      (item: string) => !keysToExclude.includes(item)
    );

    setExtraCSVHeader(extraHeaders);

    fetchSurveyModuleQuestionnaire();
    fetchTargetColumnConfig();
  }, []);

  return (
    <>
      <GlobalStyle />

      <NavWrapper>
        <HandleBackButton></HandleBackButton>

        <Title> {activeSurvey?.survey_name} </Title>
      </NavWrapper>
      {isLoading || quesLoading || locLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu />
          <TargetsSctoMapFormWrapper>
            {!hasError && !hasWarning ? (
              <>
                <div>
                  <Title>Targets: Map CSV columns</Title>
                  <DescriptionText>
                    Select corresponding CSV column for the label on the left
                  </DescriptionText>
                </div>
                <Form
                  form={targetMappingForm}
                  requiredMark={customRequiredMarker}
                >
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
                                  !moduleQuestionnaire?.target_mapping_criteria.includes(
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

                    <Form.Item
                      label="Custom columns"
                      name="custom_columns"
                      labelCol={{ span: 5 }}
                      labelAlign="left"
                    >
                      <Select
                        mode="multiple"
                        showSearch={true}
                        allowClear={true}
                        style={{ width: "70%", maxHeight: "10%" }}
                        placeholder="Select custom columns"
                        options={csvHeaderOptions}
                        maxTagCount={15}
                        onChange={(selectedItems) => {
                          const temp: any = {};
                          selectedItems.forEach((item: string) => {
                            temp[item] = true;
                          });
                          setCustomHeaderSelection(temp);
                        }}
                      />
                    </Form.Item>

                    <Button onClick={() => setOpenModal(true)}>
                      Add Filters
                    </Button>
                    <DynamicTargetFilter
                      open={openModal}
                      setOpen={setOpenModal}
                      columnList={csvHeaders}
                      inputFilterList={inputFilterList}
                      setInputFilterList={(value: any) => {
                        setInputFilterList(value);
                      }}
                    />
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
                        fontFamily: "Lato",
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
                        fontFamily: "Lato",
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
                  <CSVLink
                    data={[...errorList, ...warningList]}
                    filename={"target-error-list.csv"}
                  >
                    <Button
                      type="primary"
                      icon={<CloudDownloadOutlined />}
                      style={{ backgroundColor: "#2f54eB" }}
                    >
                      Download errors and warnings
                    </Button>
                  </CSVLink>
                  <Button
                    onClick={moveToMapping}
                    type="primary"
                    icon={<CloudUploadOutlined />}
                    style={{ marginLeft: 35, backgroundColor: "#2f54eB" }}
                  >
                    Upload corrected CSV
                  </Button>
                </div>
              </>
            )}
          </TargetsSctoMapFormWrapper>
        </div>
      )}
      <FooterWrapper>
        <SaveButton disabled>Save</SaveButton>
        <ContinueButton
          onClick={() => {
            handleTargetColumnConfig(
              form_uid,
              targetMappingForm.getFieldsValue()
            );
            handleTargetsUploadMapping(targetMappingForm.getFieldsValue());
          }}
        >
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default TargetsSctoMap;
