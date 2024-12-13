import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Row, Select, Form, message, Tag, Modal } from "antd";

import { Title, HeaderContainer } from "../../../../shared/Nav.styled";
import { CustomBtn } from "../../../../shared/Global.styled";

import SideMenu from "../../SideMenu";
import { TargetMapping } from "../../../../redux/targets/types";
import RowCountBox from "../../../../components/RowCountBox";
import Container from "../../../../components/Layout/Container";
import {
  DescriptionContainer,
  DescriptionText,
  HeadingText,
  WarningTable,
  TargetsSctoMapFormWrapper,
  SCTOQuestionsButton,
} from "./TargetsSctoMap.styled";
import {
  CloudDownloadOutlined,
  ProductOutlined,
  ReconciliationOutlined,
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
  updateTargetSCTOColumns,
  deleteAllTargets,
} from "../../../../redux/targets/targetActions";
import { getSurveyLocationGeoLevels } from "../../../../redux/surveyLocations/surveyLocationsActions";
import { useState, useEffect } from "react";

import { GlobalStyle } from "../../../../shared/Global.styled";
import DynamicTargetFilter from "../../../../components/DynamicTargetFilter";
import { set } from "lodash";
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

  const uploadMode = useAppSelector(
    (state: RootState) => state.targets.uploadMode as "overwrite" | "merge"
  );

  const locLoading = useAppSelector(
    (state: RootState) => state.surveyLocations.loading
  );

  const [targetLoading, setTargetLoading] = useState<boolean>(false);
  const [csvHeaders, setCSVHeaders] = useState<any>([]);

  const moduleQuestionnaire = useAppSelector(
    (state: RootState) => state.surveyConfig.moduleQuestionnaire
  );

  const [csvHeaderOptions, setCSVHeadersOptions] = useState<any>([]);

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

  const moveToModulePage = () => {
    navigate(`/survey-configuration/${survey_uid}`);
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

    if (update_response?.payload?.data?.success === true) {
      message.success("Column configuration updated successfully");
      return true;
    } else {
      message.error("Error updating scto column configuration");
      return false;
    }
  };

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [inputFilterList, setInputFilterList] = useState<any[]>([]);

  const [totalRecords, setTotalrecords] = useState<number>(0);
  const [correctRecords, setCorrectRecords] = useState<number>(0);

  const [surveyCTOErrorMessages, setSurveyCTOErrorMessages] = useState<
    string[]
  >([]);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);

  const [errorList, setErrorList] = useState<CSVError[]>([]);
  const [hasWarning, setHasWarning] = useState<boolean>(false);
  const [warningList, setWarningList] = useState<CSVError[]>([]);

  const [mappingSaveMode, setMappingSaveMode] = useState<string>("save");

  const loadFormQuestions = async () => {
    setLoading(true);
    const errorMessages: string[] = [];
    if (form_uid != undefined) {
      const questionsRes = await dispatch(
        updateTargetSCTOColumns({ form_uid })
      );
      if (questionsRes?.payload?.data?.success === true) {
        fetchCSVHeaders();
        message.success("Questions loaded successfully");
      } else {
        message.error("SurveyCTO Error: Failed to load questions");
      }
    } else {
      message.error(
        "Kindly check if the form_uid is provided on the url to proceed."
      );
    }
    if (errorMessages.length > 0) {
      message.error(errorMessages);
    }
    setLoading(false);
  };

  const handlePreviewData = async () => {
    setLoading(true);
    try {
      await targetMappingForm.validateFields();
      const column_mapping = targetMappingForm.getFieldsValue();
      setTargetLoading(true);
      await handleTargetColumnConfig(form_uid, column_mapping);
      await handleTargetsUploadMapping(column_mapping);
    } catch (error) {
      message.error("Validation failed. Please check the form fields.");
      return;
    }
    setTargetLoading(false);
    setLoading(false);
  };

  const handleSaveConfig = async () => {
    setLoading(true);
    try {
      await targetMappingForm.validateFields();
      const column_mapping = targetMappingForm.getFieldsValue();
      const config_success = await handleTargetColumnConfig(
        form_uid,
        column_mapping
      );
      setLoading(false);
      if (config_success) {
        moveToModulePage();
      }
    } catch (error) {
      message.error("Validation failed. Please check the form fields.");
      return;
    }
    setLoading(false);
  };

  const handleTargetsUploadMapping = async (column_mapping: any) => {
    setTargetLoading(true);
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
        mode: uploadMode,
        load_from_scto: true,
        load_successful: true,
      };

      if (form_uid !== undefined) {
        const mappingsRes = await dispatch(
          postTargetsMapping({
            targetMappingData: requestData,
            formUID: form_uid,
          })
        );
        console.log(mappingsRes.payload);

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
                const summary = mappingsRes.payload.errors[errorKey]["summary"];
                setTotalrecords(summary.total_rows);
                setCorrectRecords(summary.total_correct_rows);
                setErrorCount(summary.total_rows_with_errors);
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
            }
            setErrorList(transformedErrors);
          }
          setHasError(true);
          return;
        }

        if (mappingsRes.payload.success) {
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
    setTargetLoading(false);
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
          const form_uid = sctoForm?.payload[0]?.form_uid;
          navigate(
            `/survey-information/targets/scto_map/${survey_uid}/${form_uid}`
          );
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

        const filter_list =
          response?.payload?.data?.data.target_scto_filter_list;
        setInputFilterList(filter_list);
      } catch (error) {
        console.log("Error fetching input headers:", error);
      }
    } else {
      console.log("form_uid is undefined");
    }
  };

  const [targetIDChanged, setTargetIDChanged] = useState<boolean>(false);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleTargetIDChange = async () => {
    if (targetIDChanged) {
      setModalVisible(true);
      return;
    }
    handleContinue();
  };

  const handleContinue = async () => {
    if (mappingSaveMode === "save") {
      await handleSaveConfig();
    } else {
      await handlePreviewData();
    }
  };

  const handleDeleteAllTargets = async () => {
    try {
      setLoading(true);
      const deleteResponse = await dispatch(
        deleteAllTargets({ form_uid: form_uid! })
      );
      if (!deleteResponse.payload.success) {
        message.error("Delete failed");
      }
    } catch (error) {
      console.log("Error deleting targets", error);
    } finally {
      setLoading(false);
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
    } else {
      navigate(`/survey-information/targets/${survey_uid}/${form_uid}`);
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
    const fetchData = async () => {
      // fetch csv headers
      if (form_uid == "" || form_uid == undefined || form_uid == "undefined") {
        handleFormUID();
      } else {
        fetchTargetConfig(form_uid);
        fetchCSVHeaders();

        const keysToExclude = [
          ...mandatoryDetailsField.map((item: { key: any }) => item.key),
          ...locationDetailsField.map((item: { key: any }) => item.key),
        ];

        const extraHeaders = csvHeaders?.length
          ? csvHeaders.filter((item: string) => !keysToExclude.includes(item))
          : [];

        setExtraCSVHeader(extraHeaders);

        fetchSurveyModuleQuestionnaire();
        fetchTargetColumnConfig();
      }
    };

    fetchData();
  }, [form_uid]);

  return (
    <>
      <GlobalStyle />
      <Container surveyPage={true} />
      <HeaderContainer>
        <Title>Targets: SCTO Mapping</Title>
        {!(isLoading || quesLoading || locLoading || targetLoading) ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
              color: "#2F54EB",
            }}
          >
            <Button
              type="primary"
              icon={<ProductOutlined />}
              style={{ marginRight: 15, backgroundColor: "#2f54eB" }}
              onClick={() =>
                navigate(
                  `/survey-information/targets/config/${survey_uid}/${form_uid}`
                )
              }
            >
              Change Target Configuration
            </Button>
            {!hasError && !hasWarning ? (
              <SCTOQuestionsButton
                onClick={() => loadFormQuestions()}
                disabled={form_uid == undefined}
              >
                Load questions from SCTO form
              </SCTOQuestionsButton>
            ) : (
              <Button
                type="primary"
                icon={<ReconciliationOutlined />}
                style={{ marginRight: 15, backgroundColor: "#2f54eB" }}
                onClick={() => window.location.reload()}
              >
                Edit SCTO Column Mapping
              </Button>
            )}
          </div>
        ) : null}
      </HeaderContainer>
      {targetLoading ? (
        <FullScreenLoader loadScreenText="Kindly wait while we fetch targets from surveycto" />
      ) : isLoading || quesLoading || locLoading ? (
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
                            onChange={(value) => {
                              updateCustomColumns(value);
                              if (item.title === "Target ID") {
                                setTargetIDChanged(true);
                              }
                            }}
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

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 32,
                  }}
                >
                  <CustomBtn
                    onClick={async () => {
                      await handleTargetIDChange();
                      setMappingSaveMode("save");
                    }}
                    loading={isLoading}
                  >
                    Save Config
                  </CustomBtn>
                  <CustomBtn
                    onClick={async () => {
                      await handleTargetIDChange();
                      setMappingSaveMode("preview");
                    }}
                    loading={targetLoading}
                    style={{ marginRight: "10%" }}
                  >
                    Preview Data
                  </CustomBtn>
                </div>
                <Modal
                  title="Warning"
                  visible={modalVisible}
                  onOk={async () => {
                    setModalVisible(false);
                    await handleDeleteAllTargets();
                    handleContinue();
                  }}
                  onCancel={() => {
                    setModalVisible(false);
                    handleContinue();
                  }}
                  okText="Delete existing targets data"
                  cancelText="Merge with existing targets data"
                >
                  <p>
                    We have detected changes to target id. Do you want to delete
                    existing targets data?
                  </p>
                </Modal>
              </>
            ) : (
              <>
                <div>
                  <Title>Targets</Title>
                  <br />
                  <RowCountBox
                    total={totalRecords}
                    correct={correctRecords}
                    warning={errorCount}
                    error={0}
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
                          Correct and Re-Submit
                        </span>
                        : Once you are done with changes on SCTO Data, resubmit
                        the configuration
                      </li>
                      <li>
                        <span style={{ fontWeight: 700 }}>Manage</span>: The
                        final list of targets is present in a table and that can
                        also be downloaded.
                      </li>
                    </ol>
                  </DescriptionContainer>
                </div>
                {hasError || hasWarning ? (
                  <div style={{ marginTop: 22 }}>
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
                          dataSource={[...errorList, ...warningList]}
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
                </div>
              </>
            )}
          </TargetsSctoMapFormWrapper>
        </div>
      )}
    </>
  );
}

export default TargetsSctoMap;
