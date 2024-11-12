import { useNavigate, useParams } from "react-router-dom";
import { Button, Select, Form, message } from "antd";

import { NavWrapper, Title } from "../../../../shared/Nav.styled";
import SideMenu from "../../SideMenu";
import {
  ContinueButton,
  FooterWrapper,
  SaveButton,
} from "../../../../shared/FooterBar.styled";
import {
  DescriptionText,
  TargetsSctoMapFormWrapper,
  HeadingText,
} from "./TargetsSctoMap.styled";
import { SelectOutlined } from "@ant-design/icons";
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
} from "../../../../redux/targets/targetActions";
import { getSurveyLocationGeoLevels } from "../../../../redux/surveyLocations/surveyLocationsActions";
import { useState, useEffect } from "react";

import { GlobalStyle } from "../../../../shared/Global.styled";
import HandleBackButton from "../../../../components/HandleBackButton";
import { set } from "lodash";

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
      console.log("configData", configData);
      if (configData.target_source === "csv") {
        navigate(
          `/survey-information/targets/upload/${survey_uid}/${form_uid}`
        );
      }
    }
    setLoading(false);
  };

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
                                  message: "Kindly select column to map value!",
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
                  ) : (
                    <>
                      <HeadingText>
                        Want to map more columns, which are custom to your
                        survey and present in the csv? Click on the button below
                        after mapping the mandatory columns!
                      </HeadingText>
                      <Button
                        type="primary"
                        icon={<SelectOutlined />}
                        style={{ backgroundColor: "#2f54eB" }}
                        onClick={() => {
                          setCustomHeader(true);
                        }}
                      >
                        Map custom columns
                      </Button>
                    </>
                  )}
                </div>
              </Form>
            </>
          </TargetsSctoMapFormWrapper>
        </div>
      )}
      <FooterWrapper>
        <SaveButton disabled>Save</SaveButton>
        <ContinueButton
          onClick={() =>
            handleTargetColumnConfig(
              form_uid,
              targetMappingForm.getFieldsValue()
            )
          }
        >
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default TargetsSctoMap;
