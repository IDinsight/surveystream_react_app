import { Key, useEffect, useState } from "react";
import {
  Table,
  Button,
  Select,
  Tag,
  message,
  Drawer,
  Row,
  Col,
  Popconfirm,
} from "antd";
import {
  fetchTargetsMappingConfig,
  updateTargetsMappingConfig,
  deleteTargetsMappingConfig,
  fetchUserGenders,
  fetchUserLanguages,
  fetchUserLocations,
  updateTargetsMapping,
  fetchTargetsMapping,
} from "../../redux/mapping/apiService";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import MappingCountBox from "../../components/MappingCountBox";
import { CustomBtn } from "./Mapping.styled";

const { Option } = Select;

interface TargetMappingProps {
  formUID: string;
  SurveyUID: string;
  criteria: string[];
}

const TargetMapping = ({
  formUID,
  SurveyUID,
  criteria,
}: TargetMappingProps) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [isConfigSetupPage, setIsConfigSetupPage] = useState<boolean>(true);

  // State for mapping config and data
  const [mappingConfig, setMappingConfig] = useState<any>(null);
  const [mappingData, setMappingData] = useState<any>(null);

  // State for location criteria
  const [userLocations, setUserLocations] = useState<any>(null);
  const [selectedLocations, setSelectedLocations] = useState<any>({});

  // State for language criteria
  const [userLanguages, setUserLanguages] = useState<any>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<any>({});

  // State for gender criteria
  const [userGenders, setUserGenders] = useState<any>(null);
  const [selectedGenders, setSelectedGenders] = useState<any>({});

  // Use in case of editing the mapping
  const [selectedMappingValue, setSelectedMappingValue] = useState<any>(null);

  // Columns for mapped Pairs Table
  const mappedPairsColumns = [
    ...(criteria.includes("Location")
      ? [
          {
            title: "Target Location",
            dataIndex: "targetLocation",
            key: "targetLocation",
          },
        ]
      : []),
    ...(criteria.includes("Language")
      ? [
          {
            title: "Target Language",
            dataIndex: "targetLanguage",
            key: "targetLanguage",
          },
        ]
      : []),
    ...(criteria.includes("Gender")
      ? [
          {
            title: "Target Gender",
            dataIndex: "targetGender",
            key: "targetGender",
          },
        ]
      : []),
    {
      title: "Target Count",
      dataIndex: "targetCount",
      key: "targetCount",
    },
    ...(criteria.includes("Location")
      ? [
          {
            title: "Supervisor Location",
            dataIndex: "supervisorLocation",
            key: "supervisorLocation",
          },
        ]
      : []),
    ...(criteria.includes("Language")
      ? [
          {
            title: "Supervisor Language",
            dataIndex: "supervisorLanguage",
            key: "supervisorLanguage",
          },
        ]
      : []),
    ...(criteria.includes("Gender")
      ? [
          {
            title: "Supervisor Gender",
            dataIndex: "supervisorGender",
            key: "supervisorGender",
          },
        ]
      : []),
    {
      title: "Supervisor Count",
      dataIndex: "supervisorCount",
      key: "supervisorCount",
    },
    {
      title: "Mapping Status",
      dataIndex: "status",
      key: "status",
      render: (status: any) => (
        <Tag color={status === "Complete" ? "green" : "red"}>{status}</Tag>
      ),
    },
  ];

  // Columns for Unmapped Pairs Table
  const unmappedColumns = [
    ...(criteria.includes("Location")
      ? [
          {
            title: "Target Location",
            dataIndex: "targetLocation",
            key: "targetLocation",
          },
        ]
      : []),
    ...(criteria.includes("Language")
      ? [
          {
            title: "Target Language",
            dataIndex: "targetLanguage",
            key: "targetLanguage",
          },
        ]
      : []),
    ...(criteria.includes("Gender")
      ? [
          {
            title: "Target Gender",
            dataIndex: "targetGender",
            key: "targetGender",
          },
        ]
      : []),
    {
      title: "Target Count",
      dataIndex: "targetCount",
      key: "targetCount",
    },
    ...(criteria.includes("Location")
      ? [
          {
            title: "Supervisor Location",
            dataIndex: "supervisorLocation",
            key: "supervisorLocation",
            render: (_: any, record: any) => (
              <Select
                style={{ width: 200 }}
                placeholder="Select location"
                onChange={(value) =>
                  handleMappingConfigChange("Location", value, record)
                }
              >
                {[
                  ...new Map(
                    userLocations?.map((item: any) => [
                      item.location_uid,
                      {
                        location_uid: item.location_uid,
                        location_name: item.location_name,
                      },
                    ])
                  ).values(),
                ]?.map((location: any) => (
                  <Option
                    key={location.location_uid}
                    value={location.location_uid}
                  >
                    {location.location_name}
                  </Option>
                ))}
              </Select>
            ),
          },
        ]
      : []),
    ...(criteria.includes("Language")
      ? [
          {
            title: "Supervisor Language",
            dataIndex: "supervisorLanguage",
            key: "supervisorLanguage",
            render: (_: any, record: any) => (
              <Select
                style={{ width: 200 }}
                placeholder="Select language"
                onChange={(value) =>
                  handleMappingConfigChange("Language", value, record)
                }
              >
                {[
                  ...new Set(userLanguages?.map((item: any) => item.language)),
                ]?.map((lang: any) => (
                  <Option key={lang} value={lang}>
                    {lang}
                  </Option>
                ))}
              </Select>
            ),
          },
        ]
      : []),
    ...(criteria.includes("Gender")
      ? [
          {
            title: "Supervisor Gender",
            dataIndex: "supervisorGender",
            key: "supervisorGender",
            render: (_: any, record: any) => (
              <Select
                style={{ width: 200 }}
                placeholder="Select gender"
                onChange={(value) =>
                  handleMappingConfigChange("Gender", value, record)
                }
              >
                {[
                  ...new Set(userGenders?.map((item: any) => item.gender)),
                ]?.map((gender: any) => (
                  <Option key={gender} value={gender}>
                    {gender}
                  </Option>
                ))}
              </Select>
            ),
          },
        ]
      : []),
    {
      title: "Supervisor Count",
      dataIndex: "supervisorCount",
      key: "supervisorCount",
    },
    {
      title: "Mapping Status",
      dataIndex: "mappingStatus",
      key: "mappingStatus",
      render: () => <Tag color="red">Pending</Tag>,
    },
  ];

  // Filter out the mapped pairs from the main mapping config
  // and map the data to the columns for table
  const mappedTargets = mappingConfig?.filter(
    (config: any) => config.supervisor_mapping_criteria_values !== null
  );

  const mappedPairsData = mappedTargets?.map((config: any, index: number) => {
    return {
      key: "mappedPair" + index,
      targetLocation:
        config.target_mapping_criteria_values?.other?.location_name,
      targetLanguage: config.target_mapping_criteria_values.criteria?.Language,
      targetGender: config.target_mapping_criteria_values.criteria?.Gender,
      targetCount: config.target_count,
      supervisorLocation:
        config.supervisor_mapping_criteria_values?.other?.location_name,
      supervisorLanguage:
        config.supervisor_mapping_criteria_values.criteria?.Language,
      supervisorGender:
        config.supervisor_mapping_criteria_values.criteria?.Gender,
      supervisorCount: config.supervisor_count,
      status: config.mapping_status,
    };
  });

  // Filter out the unmapped targets from the mapping config
  // and map the data to the columns for table
  const unmappedTargets = mappingConfig?.filter(
    (config: any) => config.supervisor_mapping_criteria_values === null
  );

  const unmappedPairData = unmappedTargets?.map(
    (config: any, index: number) => {
      const key = "unmappedPair" + index;

      const isSelectionMade =
        selectedLocations[key] ||
        selectedLanguages[key] ||
        selectedGenders[key];

      const selectedLocation = selectedLocations[key]?.mapping_to;
      const selectedLanguage = selectedLanguages[key]?.mapping_to;
      const selectedGender = selectedGenders[key]?.mapping_to;

      let supervisiorList: number[] = [];

      // Filter by Location
      if (criteria.includes("Location") && selectedLocation) {
        supervisiorList =
          userLocations
            ?.filter((loc: any) => loc.location_uid === selectedLocation)
            ?.map((loc: any) => loc.user_uid) || [];
      }

      // Filter by Language
      if (criteria.includes("Language") && selectedLanguage) {
        const languageFiltered =
          userLanguages
            ?.filter((lang: any) => lang.language === selectedLanguage)
            ?.map((lang: any) => lang.user_uid) || [];
        supervisiorList =
          supervisiorList.length > 0
            ? supervisiorList.filter((user_uid) =>
                languageFiltered.includes(user_uid)
              )
            : languageFiltered;
      }

      // Filter by Gender
      if (criteria.includes("Gender") && selectedGender) {
        const genderFiltered =
          userGenders
            ?.filter((gender: any) => gender.gender === selectedGender)
            ?.map((gender: any) => gender.user_uid) || [];
        supervisiorList =
          supervisiorList.length > 0
            ? supervisiorList.filter((user_uid) =>
                genderFiltered.includes(user_uid)
              )
            : genderFiltered;
      }

      return {
        key: key,
        targetLocation:
          config.target_mapping_criteria_values?.other.location_name,
        targetLocationUID:
          config.target_mapping_criteria_values.criteria.Location,
        targetLanguage:
          config.target_mapping_criteria_values.criteria?.Language,
        targetGender: config.target_mapping_criteria_values.criteria?.Gender,
        targetCount: config.target_count,
        supervisorCount: isSelectionMade ? supervisiorList.length : null,
      };
    }
  );

  const handleMappingConfigChange = (
    type: "Location" | "Language" | "Gender",
    value: any,
    record: any
  ) => {
    const updateState = (prev: any) => ({
      ...prev,
      [record.key]: {
        mapping_from:
          type === "Location"
            ? record.targetLocationUID
            : type === "Language"
            ? record.targetLanguage
            : record.targetGender,
        mapping_to: value,
      },
    });

    if (type === "Location") {
      setSelectedLocations(updateState);
    } else if (type === "Language") {
      setSelectedLanguages(updateState);
    } else if (type === "Gender") {
      setSelectedGenders(updateState);
    }
  };

  const handleConfigSave = () => {
    const mappingConfigPayload: any = [];

    // Create the payload for mapped target
    mappedTargets.forEach((target: any) => {
      const mappingValues = criteria.map((criterion) => ({
        criteria: criterion,
        value: target.target_mapping_criteria_values.criteria[criterion],
      }));

      const mappedToValues = criteria.map((criterion) => ({
        criteria: criterion,
        value: target.supervisor_mapping_criteria_values.criteria[criterion],
      }));

      mappingConfigPayload.push({
        mapping_values: mappingValues,
        mapped_to: mappedToValues,
      });
    });

    // Create the payload for unmapped targets for each criterion
    const selectedCriteria: any = {
      Location: selectedLocations,
      Language: selectedLanguages,
      Gender: selectedGenders,
    };

    const combinedSelectedItems: any = {};

    Object.keys(selectedCriteria).forEach((criterion) => {
      const selectedItems = selectedCriteria[criterion];
      Object.keys(selectedItems).forEach((key) => {
        if (!combinedSelectedItems[key]) {
          combinedSelectedItems[key] = {};
        }
        combinedSelectedItems[key][criterion] = selectedItems[key];
      });
    });

    Object.keys(combinedSelectedItems).forEach((key) => {
      const value = combinedSelectedItems[key];
      const mappingValues: any = [];
      const mappedToValues: any = [];

      criteria.forEach((criterion) => {
        if (value[criterion]) {
          mappingValues.push({
            criteria: criterion,
            value: value[criterion].mapping_from,
          });
          mappedToValues.push({
            criteria: criterion,
            value: value[criterion].mapping_to,
          });
        }
      });

      const existingPayload = mappingConfigPayload.find(
        (payload: any) =>
          JSON.stringify(payload.mapping_values) ===
            JSON.stringify(mappingValues) &&
          JSON.stringify(payload.mapped_to) === JSON.stringify(mappedToValues)
      );

      if (!existingPayload) {
        mappingConfigPayload.push({
          mapping_values: mappingValues,
          mapped_to: mappedToValues,
        });
      }
    });

    const targetssMappingConfigPayload = {
      form_uid: formUID,
      mapping_config: mappingConfigPayload,
    };

    setLoading(true);
    updateTargetsMappingConfig(formUID, targetssMappingConfigPayload).then(
      (res: any) => {
        if (res?.data?.success || res?.data?.message === "Success") {
          message.success("Mapping updated successfully");
          setLoading(true);
          fetchTargetsMappingConfig(formUID).then((res: any) => {
            if (res?.data?.success) {
              setSelectedLocations({});
              setMappingConfig(res?.data?.data);
            } else {
              message.error(
                "Failed to fetch mapping config. Please refresh the page"
              );
            }
            setLoading(false);
          });
        } else {
          message.error("Failed to update mapping");
        }
        setLoading(false);
      }
    );
  };

  const handleTargetMappingSave = () => {
    const mappingsPayload = selectedTargetRows?.map((target: any) => {
      return {
        target_uid: target.targetUID,
        supervisor_uid: selectedMappingValue,
      };
    });

    if (mappingsPayload.length === 0) {
      message.error("Please select a supervisor to map");
      return;
    }

    setLoading(true);
    updateTargetsMapping(formUID, mappingsPayload).then((res: any) => {
      if (res?.data?.success) {
        message.success("Target to Supervisor mapping updated successfully");
        setLoading(true);
        fetchTargetsMapping(formUID).then((res: any) => {
          if (res?.data?.success) {
            setMappingData(res?.data?.data);
          } else {
            message.error("Failed to fetch mapping");
          }
          setLoading(false);
        });
        onDrawerClose();
      } else {
        if (res?.response?.data.errors?.record_errors) {
          message.error(res?.response?.data.errors?.record_errors);
        } else {
          message.error("Failed to update mapping");
        }
      }
      setLoading(false);
    });
  };

  const handleContinue = () => {
    setLoading(true);
    fetchTargetsMapping(formUID).then((res: any) => {
      if (res?.data?.success) {
        setMappingData(res?.data?.data);
        setIsConfigSetupPage(false);
      } else {
        message.error("Failed to fetch mapping");
      }
      setLoading(false);
    });
  };

  const resetMappingConfig = () => {
    // Reset the existing mapping config
    setLoading(true);
    deleteTargetsMappingConfig(formUID).then((res: any) => {
      if (res?.data?.success) {
        message.success("Mapping reset successfully");
        setLoading(true);
        fetchTargetsMappingConfig(formUID).then((res: any) => {
          if (res?.data?.success) {
            // Reset the mapping config state
            setMappingConfig(res?.data?.data);
          } else {
            message.error("Failed to fetch mapping config");
          }
          setLoading(false);
        });
      } else {
        message.error("Failed to reset mapping");
      }
      setLoading(false);
    });
  };

  const targetsMappingColumns: any = [
    {
      title: "Target ID",
      dataIndex: "targetID",
      key: "targetID",
    },
    ...(criteria.includes("Location") || criteria.includes("Manual")
      ? [
          {
            title: "Target Location ID",
            dataIndex: "targetLocationID",
            key: "targetLocationID",
          },
          {
            title: "Target Location",
            dataIndex: "targetLocation",
            key: "targetLocation",
          },
        ]
      : []),
    ...(criteria.includes("Language") || criteria.includes("Manual")
      ? [
          {
            title: "Target Language",
            dataIndex: "targetLanguage",
            key: "targetLanguage",
          },
        ]
      : []),
    ...(criteria.includes("Gender") || criteria.includes("Manual")
      ? [
          {
            title: "Target Gender",
            dataIndex: "targetGender",
            key: "targetGender",
          },
        ]
      : []),
    {
      title: "Supervisor Email",
      dataIndex: "supervisorEmail",
      key: "supervisorEmail",
      filters: [
        ...new Map(
          mappingData?.map((target: { supervisor_email: string }) => [
            target.supervisor_email,
            target.supervisor_email,
          ])
        ).values(),
      ].map((email) => ({
        text: email as React.ReactNode,
        value: email as string,
      })),
      onFilter: (value: boolean | Key, record: { supervisorEmail: string }) =>
        typeof value === "string" &&
        record.supervisorEmail?.indexOf(value) === 0,
    },
    {
      title: "Supervisor Name",
      dataIndex: "supervisorName",
      key: "supervisorName",
      filters: [
        ...new Map(
          mappingData?.map(
            (target: { supervisor_uid: string; supervisor_name: string }) => [
              target.supervisor_uid,
              target.supervisor_name,
            ]
          )
        ).values(),
      ].map((name) => ({
        text: name as React.ReactNode,
        value: name as string,
      })),
      onFilter: (value: boolean | Key, record: { supervisorName: string }) =>
        typeof value === "string" &&
        record.supervisorName?.indexOf(value) === 0,
    },
    ...(criteria.includes("Location") && !criteria.includes("Manual")
      ? [
          {
            title: "Supervisor Location",
            dataIndex: "supervisorLocation",
            key: "supervisorLocation",
          },
        ]
      : []),
    ...(criteria.includes("Language") && !criteria.includes("Manual")
      ? [
          {
            title: "Supervisor Language",
            dataIndex: "supervisorLanguage",
            key: "supervisorLanguage",
          },
        ]
      : []),
    ...(criteria.includes("Gender") && !criteria.includes("Manual")
      ? [
          {
            title: "Supervisor Gender",
            dataIndex: "supervisorGender",
            key: "supervisorGender",
          },
        ]
      : []),
  ];

  const mappingTableData = mappingData?.map((target: any) => {
    return {
      key: target.target_uid,
      targetID: target.target_uid,
      targetUID: target.target_uid,
      targetLocationID: target?.location_id?.[0],
      targetLocation: target?.location_name?.[0],
      targetLanguage: target?.language,
      targetGender: target?.gender,
      supervisorEmail: target.supervisor_email,
      supervisorName: target.supervisor_name,
      supervisorUID: target.supervisor_uid,
      supervisorLocation:
        target.supervisor_mapping_criteria_values?.other?.location_name,
      supervisorLocationUID:
        target.supervisor_mapping_criteria_values.criteria?.Location,
      supervisorLanguage:
        target.supervisor_mapping_criteria_values.criteria?.Language,
      supervisorGender:
        target.supervisor_mapping_criteria_values.criteria?.Gender,
    };
  });

  const getSupervisorOptionList = () => {
    const userList: any = [];

    if (criteria.includes("Location")) {
      userLocations?.map((user: any) => {
        if (user.location_uid === selectedTargetRows[0].supervisorLocationUID) {
          userList.push({
            user_uid: user.user_uid,
            user_name: user.user_name,
          });
        }
      });
    }

    if (criteria.includes("Language")) {
      userLanguages?.map((user: any) => {
        if (user.language === selectedTargetRows[0].supervisorLanguage) {
          userList.push({
            user_uid: user.user_uid,
            user_name: user.user_name,
          });
        }
      });
    }

    if (criteria.includes("Gender")) {
      userLanguages?.map((user: any) => {
        if (user.language === selectedTargetRows[0].supervisorGender) {
          userList.push({
            user_uid: user.user_uid,
            user_name: user.user_name,
          });
        }
      });
    }

    // If criteria is manual, then show all the user from user-locataions, user-languages, user-genders
    if (criteria.includes("Manual")) {
      userLocations?.map((user: any) => {
        userList.push({
          user_uid: user.user_uid,
          user_name: user.user_name,
        });
      });

      userLanguages?.map((user: any) => {
        userList.push({
          user_uid: user.user_uid,
          user_name: user.user_name,
        });
      });

      userGenders?.map((user: any) => {
        userList.push({
          user_uid: user.user_uid,
          user_name: user.user_name,
        });
      });
    }

    return userList.map((user: any) => (
      <Option key={user.user_uid} value={user.user_uid}>
        {user.user_name}
      </Option>
    ));
  };

  const [selectedTargetRows, setSelectedTargetRows] = useState<any>([]);

  const rowSelection = {
    selectedTargetRows,
    onSelect: (record: any, selected: any, selectedRow: any) => {
      setSelectedTargetRows(selectedRow);
    },
    onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {
      setSelectedTargetRows(selectedRows);
    },
    getCheckboxProps: (record: any) => {
      const isManual = criteria.includes("Manual");
      const isDisabled =
        !isManual &&
        selectedTargetRows.length > 0 &&
        selectedTargetRows[0] &&
        ((criteria.includes("Location") &&
          record.supervisorLocation !==
            selectedTargetRows[0].supervisorLocation) ||
          (criteria.includes("Language") &&
            record.supervisorLanguage !==
              selectedTargetRows[0].supervisorLanguage) ||
          (criteria.includes("Gender") &&
            record.supervisorGender !==
              selectedTargetRows[0].supervisorGender));

      return {
        disabled: isDisabled,
      };
    },
  };

  const [isEditingOpen, setIsEditingOpen] = useState(false);

  const showDrawer = () => {
    setIsEditingOpen(true);
  };

  const onDrawerClose = () => {
    setIsEditingOpen(false);
  };

  useEffect(() => {
    if (formUID) {
      setLoading(true);
      fetchTargetsMappingConfig(formUID).then((res: any) => {
        if (res?.data?.success) {
          setMappingConfig(res?.data?.data);
        } else {
          message.error("Failed to fetch mapping config");
        }
        setLoading(false);
      });

      if (criteria.includes("Location") || criteria.includes("Manual")) {
        fetchUserLocations(SurveyUID).then((res: any) => {
          if (res?.data?.success) {
            const userLocations = res?.data?.data;
            setUserLocations(userLocations);
          } else {
            if (!criteria.includes("Manual")) {
              message.error("Failed to fetch user locations");
            }
          }
        });
      }

      if (criteria.includes("Language") || criteria.includes("Manual")) {
        fetchUserLanguages(SurveyUID).then((res: any) => {
          if (res?.data?.success) {
            setUserLanguages(res?.data?.data);
          } else {
            if (!criteria.includes("Manual")) {
              message.error("Failed to fetch user languages");
            }
          }
        });
      }

      if (criteria.includes("Gender") || criteria.includes("Manual")) {
        fetchUserGenders(SurveyUID).then((res: any) => {
          if (res?.data?.success) {
            setUserGenders(res?.data?.data);
          } else {
            if (!criteria.includes("Manual")) {
              message.error("Failed to fetch user gender");
            }
          }
        });
      }
    }
  }, [formUID, SurveyUID]);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      {isConfigSetupPage ? (
        <div>
          <div style={{ display: "flex" }}>
            <p style={{ fontWeight: "bold" }}>Mapped Pairs:</p>
            <Popconfirm
              title="Delete"
              description="Are you sure to delete mapping config?"
              onConfirm={resetMappingConfig}
              okText="Delete"
              cancelText="No"
            >
              <Button
                danger
                style={{ marginLeft: "auto" }}
                disabled={criteria.includes("Manual")}
              >
                Reset Mapping
              </Button>
            </Popconfirm>
          </div>
          <Table
            columns={mappedPairsColumns}
            dataSource={mappedPairsData}
            pagination={false}
          />
          {unmappedTargets?.length > 0 && (
            <>
              <p style={{ marginTop: "36px", fontWeight: "bold" }}>
                There is no mapping available for below listed Target, please
                map them manually:
              </p>
              <Table
                columns={unmappedColumns}
                dataSource={unmappedPairData}
                pagination={false}
              />
            </>
          )}
          <div style={{ marginTop: "20px" }}>
            <CustomBtn
              type="primary"
              style={{ marginRight: "10px" }}
              onClick={handleConfigSave}
              disabled={
                criteria.includes("Manual") || !(unmappedPairData?.length > 0)
              }
            >
              Save
            </CustomBtn>
            <Button
              disabled={unmappedTargets?.length > 0}
              onClick={handleContinue}
            >
              Continue
            </Button>
            <Button style={{ marginLeft: "10px" }} onClick={() => navigate(0)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MappingCountBox
              mapped={
                mappingTableData?.filter(
                  (target: any) => target.supervisorEmail !== null
                ).length
              }
              unmapped={
                mappingTableData?.filter(
                  (target: any) => target.supervisorEmail === null
                ).length
              }
            />
            {selectedTargetRows.length > 0 ? (
              <Button
                type="primary"
                style={{ marginLeft: "auto" }}
                onClick={() => showDrawer()}
              >
                Edit
              </Button>
            ) : null}
          </div>
          <Table
            columns={targetsMappingColumns}
            dataSource={mappingTableData}
            rowSelection={rowSelection}
            scroll={criteria.includes("Manual") ? { x: 1500 } : {}}
            pagination={{
              pageSize: 5,
              showSizeChanger: false,
            }}
          />
          {selectedTargetRows.length > 0 && (
            <Drawer
              title="Edit Target to Supervisor Mapping"
              onClose={onDrawerClose}
              open={isEditingOpen}
              width={480}
            >
              <Row>
                <Col span={8}>
                  {criteria.includes("Location") && <p>Target Location:</p>}
                  {criteria.includes("Language") && <p>Target Language:</p>}
                  {criteria.includes("Gender") && <p>Target Gender:</p>}
                  {criteria.includes("Manual") && <p>Target count:</p>}
                </Col>
                <Col span={12}>
                  {criteria.includes("Location") && (
                    <p>{selectedTargetRows[0].targetLocation}</p>
                  )}
                  {criteria.includes("Language") && (
                    <p>{selectedTargetRows[0].targetLanguage}</p>
                  )}
                  {criteria.includes("Gender") && (
                    <p>{selectedTargetRows[0].targetGender}</p>
                  )}
                  {criteria.includes("Manual") && (
                    <p>{selectedTargetRows.length}</p>
                  )}
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <p>Supervisor:</p>
                </Col>
                <Col span={12}>
                  <Select
                    style={{ width: "100%" }}
                    defaultValue={() => {
                      selectedMappingValue(selectedTargetRows[0].supervisorUID);
                      return selectedTargetRows[0].supervisorUID;
                    }}
                    value={selectedMappingValue}
                    onChange={(value) => setSelectedMappingValue(value)}
                  >
                    {getSupervisorOptionList()}
                  </Select>
                </Col>
              </Row>
              <div style={{ marginTop: 16 }}>
                <Button type="primary" onClick={handleTargetMappingSave}>
                  Save
                </Button>
                <Button style={{ marginLeft: 16 }} onClick={onDrawerClose}>
                  Cancel
                </Button>
              </div>
            </Drawer>
          )}
        </div>
      )}
    </>
  );
};

export default TargetMapping;
