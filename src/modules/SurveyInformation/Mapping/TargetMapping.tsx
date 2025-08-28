import { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import {
  Breadcrumb,
  Button,
  Select,
  Tag,
  message,
  Drawer,
  Row,
  Col,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  fetchTargetsMappingConfig,
  updateTargetsMappingConfig,
  deleteTargetsMappingConfig,
  resetTargetsMappingConfig,
  fetchUserGenders,
  fetchUserLanguages,
  fetchUserLocations,
  fetchTargetsMapping,
  updateTargetsMapping,
} from "../../../redux/mapping/apiService";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { MappingTable, DeleteButton, ResetButton } from "./Mapping.styled";
import { CustomBtn } from "../../../shared/Global.styled";
import { useAppDispatch } from "./../../../redux/hooks";
import { updateMappingStatsSuccess } from "./../../../redux/mapping/mappingSlice";
import {
  ClearOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import MappingError from "../../../components/MappingError";
import { HeaderContainer } from "../../../shared/Nav.styled";
import MappingStats from "../../../components/MappingStats";
import SideMenu from "../SideMenu";
import { MappingWrapper } from "./Mapping.styled";
import { resolveSurveyNotification } from "../../../redux/notifications/notificationActions";
import { properCase } from "../../../utils/helper";
import DescriptionLink from "../../../components/DescriptionLink";
import { DescriptionText } from "../SurveyInformation.styled";

const { Option } = Select;

interface TargetMappingProps {
  formUID: string;
  SurveyUID: string;
  mappingName: string;
  criteria: string[];
  pageNumber: number;
}

const TargetMapping = ({
  formUID,
  SurveyUID,
  mappingName,
  criteria,
  pageNumber,
}: TargetMappingProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [tablePageSize, setTablePageSize] = useState(10);

  // State for mapping config and data
  const [mappingConfig, setMappingConfig] = useState<any>(null);
  const [mappingData, setMappingData] = useState<any>(null);
  const [originalMappingData, setOriginalMappingData] = useState<any>(null);

  const [loadingMappingConfig, setLoadingMappingConfig] =
    useState<boolean>(false);
  const [loadingMappingData, setLoadingMappingData] = useState<boolean>(false);

  const [loadMappingConfigError, setLoadMappingConfigError] =
    useState<string>("");
  const [loadMappingDataError, setLoadMappingDataError] = useState<string>("");

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

  const { loading: mappingLoading, stats: mappingStats } = useAppSelector(
    (state: RootState) => state.mapping
  );

  const { loading: isSideMenuLoading } = useAppSelector(
    (state: RootState) => state.surveyConfig
  );
  // Columns for mapped Pairs Table
  const mappedPairsColumns = [
    // Location group
    ...(criteria.includes("Location")
      ? [
          {
            title: "Location",
            children: [
              {
                title: "Target",
                dataIndex: "targetLocation",
                key: "targetLocation",
                width: 100,
              },
              {
                title: "Supervisor",
                dataIndex: "supervisorLocation",
                key: "supervisorLocation",
                width: 100,
              },
            ],
          },
        ]
      : []),

    // Language group
    ...(criteria.includes("Language")
      ? [
          {
            title: "Language",
            children: [
              {
                title: "Target",
                dataIndex: "targetLanguage",
                key: "targetLanguage",
                width: 100,
              },
              {
                title: "Supervisor",
                dataIndex: "supervisorLanguage",
                key: "supervisorLanguage",
                width: 100,
              },
            ],
          },
        ]
      : []),

    // Gender group
    ...(criteria.includes("Gender")
      ? [
          {
            title: "Gender",
            children: [
              {
                title: "Target",
                dataIndex: "targetGender",
                key: "targetGender",
                width: 100,
              },
              {
                title: "Supervisor",
                dataIndex: "supervisorGender",
                key: "supervisorGender",
                width: 100,
              },
            ],
          },
        ]
      : []),
    // Count group
    {
      title: "Count",
      children: [
        {
          title: "Target",
          dataIndex: "targetCount",
          key: "targetCount",
          width: 100,
        },
        {
          title: "Supervisor",
          dataIndex: "supervisorCount",
          key: "supervisorCount",
          width: 100,
        },
      ],
    },
    {
      title: "Mapping Status",
      dataIndex: "status",
      key: "status",
      render: (status: any) => (
        <Tag color={status === "Complete" ? "green" : "red"}>{status}</Tag>
      ),
      width: 100,
    },
    {
      title: (
        <Tooltip title="Delete action is enabled for rows with manually mapped mapping criteria values">
          Action
        </Tooltip>
      ),
      key: "action",
      render: (_: any, record: any) =>
        record.targetLocation !== record.supervisorLocation ||
        record.targetLanguage !== record.supervisorLanguage ||
        record.targetGender !== record.supervisorGender ? (
          <Popconfirm
            title="Delete"
            description="Are you sure you want to delete this mapping config?"
            onConfirm={() => handleConfigDelete(record.config_uid)}
            okText="Delete"
            cancelText="No"
          >
            <DeleteButton type="link">
              <DeleteOutlined />
            </DeleteButton>
          </Popconfirm>
        ) : null,
      width: 80,
    },
  ];

  // Columns for Unmapped Pairs Table
  const unmappedColumns = [
    // Location group
    ...(criteria.includes("Location")
      ? [
          {
            title: "Location",
            children: [
              {
                title: "Target",
                dataIndex: "targetLocation",
                key: "targetLocation",
                width: 100,
              },
              {
                title: "Supervisor",
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
            ],
          },
        ]
      : []),

    // Language group
    ...(criteria.includes("Language")
      ? [
          {
            title: "Language",
            children: [
              {
                title: "Target",
                dataIndex: "targetLanguage",
                key: "targetLanguage",
                width: 100,
              },
              {
                title: "Supervisor",
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
                      ...new Set(
                        userLanguages?.map((item: any) => item.language)
                      ),
                    ]?.map((lang: any) => (
                      <Option key={lang} value={lang}>
                        {lang}
                      </Option>
                    ))}
                  </Select>
                ),
              },
            ],
          },
        ]
      : []),

    // Gender group
    ...(criteria.includes("Gender")
      ? [
          {
            title: "Gender",
            children: [
              {
                title: "Target",
                dataIndex: "targetGender",
                key: "targetGender",
                width: 100,
              },
              {
                title: "Supervisor",
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
            ],
          },
        ]
      : []),
    {
      title: "Count",
      children: [
        {
          title: "Target",
          dataIndex: "targetCount",
          key: "targetCount",
          width: 100,
        },
        {
          title: "Supervisor",
          dataIndex: "supervisorCount",
          key: "supervisorCount",
          width: 101,
        },
      ],
    },
    {
      title: "Mapping Status",
      dataIndex: "mappingStatus",
      key: "mappingStatus",
      render: () => <Tag color="red">Pending</Tag>,
      width: 100,
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
      config_uid: config.config_uid,
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

  const handleConfigDelete = (configUID: string) => {
    setLoadingMappingConfig(true);
    deleteTargetsMappingConfig(formUID, configUID).then((res: any) => {
      if (res?.data?.success) {
        message.success("Mapping deleted successfully");
        setLoadingMappingConfig(true);
        fetchTargetsMappingConfig(formUID).then((res: any) => {
          if (res?.data?.success) {
            setMappingConfig(res?.data?.data);
            setLoadMappingConfigError("");
          } else {
            const error_message = res.response?.data?.errors?.mapping_errors
              ? res.response?.data?.errors?.mapping_errors
              : res.response?.data?.errors?.message
              ? res.response?.data?.errors?.message
              : "Failed to fetch mapping config";
            message.error(error_message);
            setLoadMappingConfigError(error_message);
          }
          setLoadingMappingConfig(false);
        });
      } else {
        message.error("Failed to delete mapping");
      }
      setLoadingMappingConfig(false);
    });
  };

  const handleConfigSave = () => {
    const hasValidMapping = unmappedPairData.some(
      (record: any) =>
        record.supervisorCount !== null && record.supervisorCount !== 0
    );

    if (!hasValidMapping) {
      message.error(
        "At least one mapping selection must contain a supervisor count"
      );
      return;
    }

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

    setLoadingMappingConfig(true);
    updateTargetsMappingConfig(formUID, targetssMappingConfigPayload).then(
      (res: any) => {
        if (res?.data?.success || res?.data?.message === "Success") {
          message.success("Mapping updated successfully");
          setLoadingMappingConfig(true);
          fetchTargetsMappingConfig(formUID).then((res: any) => {
            if (res?.data?.success) {
              setSelectedLocations({});
              setMappingConfig(res?.data?.data);
              setLoadMappingConfigError("");
            } else {
              const error_message = res.response?.data?.errors?.mapping_errors
                ? res.response?.data?.errors?.mapping_errors
                : res.response?.data?.errors?.message
                ? res.response?.data?.errors?.message
                : "Failed to fetch mapping config";
              message.error(error_message);
              setLoadMappingConfigError(error_message);
            }
            setLoadingMappingConfig(false);
          });
        } else {
          message.error("Failed to update mapping");
        }
        setLoadingMappingConfig(false);
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

    setLoadingMappingData(true);
    updateTargetsMapping(formUID, mappingsPayload).then((res: any) => {
      if (res?.data?.success) {
        message.success("Target to Supervisor mapping updated successfully");
        setLoadingMappingData(true);
        fetchTargetsMapping(formUID).then((res: any) => {
          if (res?.data?.success) {
            setMappingData(res?.data?.data);
            populateMappingStats(res?.data?.data);
            setLoadMappingDataError("");
          } else {
            const error_message = res.response?.data?.errors?.mapping_errors
              ? res.response?.data?.errors?.mapping_errors
              : res.response?.data?.errors?.message
              ? res.response?.data?.errors?.message
              : "Failed to fetch mapping";
            message.error(error_message);
            setLoadMappingDataError(error_message);
          }
          setLoadingMappingData(false);
        });
        setSelectedMappingValue(null);
        onDrawerClose();
      } else {
        if (res?.response?.data.errors?.record_errors) {
          message.error(res?.response?.data.errors?.record_errors);
        } else {
          message.error("Failed to update mapping");
        }
      }
      setLoadingMappingData(false);
    });
  };

  const handleContinue = () => {
    navigate(
      `/survey-information/mapping/${mappingName}/${SurveyUID}?form_uid=${formUID}&page=2`
    );
  };

  const resetMappingConfig = () => {
    // Reset the existing mapping config
    setLoadingMappingConfig(true);
    resetTargetsMappingConfig(formUID).then((res: any) => {
      if (res?.data?.success) {
        message.success("Mapping reset successfully");
        setLoadingMappingConfig(true);
        fetchTargetsMappingConfig(formUID).then((res: any) => {
          if (res?.data?.success) {
            // Reset the mapping config state
            setMappingConfig(res?.data?.data);
            setLoadMappingConfigError("");
          } else {
            const error_message = res.response?.data?.errors?.mapping_errors
              ? res.response?.data?.errors?.mapping_errors
              : res.response?.data?.errors?.message
              ? res.response?.data?.errors?.message
              : "Failed to fetch mapping config";
            message.error(error_message);
            setLoadMappingConfigError(error_message);
          }
          setLoadingMappingConfig(false);
        });
      } else {
        message.error("Failed to reset mapping");
      }
      setLoadingMappingConfig(false);
    });
  };

  const targetsMappingColumns: any = [
    {
      title: "Target",
      children: [
        {
          title: "ID",
          dataIndex: "targetID",
          key: "targetID",
          sorter: (a: any, b: any) => a.targetID - b.targetID,
          width: 100,
          filters: [
            ...new Set(mappingData?.map((target: any) => target.target_id)),
          ].map((id) => ({
            text: id,
            value: id,
          })),
          filterSearch: true,
          onFilter: (value: any, record: any) => record.targetID === value,
        },
        ...(criteria.includes("Location") || criteria.includes("Manual")
          ? [
              {
                title: "Location ID",
                dataIndex: "targetLocationID",
                key: "targetLocationID",
                sorter: (a: any, b: any) =>
                  a.targetLocationID - b.targetLocationID,
                filters: [
                  ...new Set(
                    mappingData?.map((target: any) => target.location_id)
                  ),
                ].map((location) => ({
                  text: location,
                  value: location,
                })),
                filterSearch: true,
                onFilter: (value: any, record: any) =>
                  record.targetLocationID === value,
                width: 150,
              },
              {
                title: "Location",
                dataIndex: "targetLocation",
                key: "targetLocation",
                sorter: (a: any, b: any) =>
                  a.targetLocation.localeCompare(b.targetLocation),
                filters: [
                  ...new Set(
                    mappingData?.map((target: any) => target.location_name)
                  ),
                ].map((location) => ({
                  text: location,
                  value: location,
                })),
                filterSearch: true,
                onFilter: (value: any, record: any) =>
                  record.targetLocation.indexOf(value) === 0,
                width: 100,
              },
            ]
          : []),
        ...(criteria.includes("Language") || criteria.includes("Manual")
          ? [
              {
                title: "Language",
                dataIndex: "targetLanguage",
                key: "targetLanguage",
                sorter: (a: any, b: any) =>
                  a.targetLanguage.localeCompare(b.targetLanguage),
                filters: [
                  ...new Set(
                    mappingData?.map((target: any) => target?.language)
                  ),
                ].map((language) => ({
                  text: language,
                  value: language,
                })),
                filterSearch: true,
                onFilter: (value: any, record: any) =>
                  record.targetLanguage.indexOf(value) === 0,
                width: 100,
              },
            ]
          : []),
        ...(criteria.includes("Gender") || criteria.includes("Manual")
          ? [
              {
                title: "Gender",
                dataIndex: "targetGender",
                key: "targetGender",
                sorter: (a: any, b: any) =>
                  a.targetGender.localeCompare(b.targetGender),
                filters: [
                  ...new Set(mappingData?.map((target: any) => target?.gender)),
                ].map((gender) => ({
                  text: gender,
                  value: gender,
                })),
                filterSearch: true,
                onFilter: (value: any, record: any) =>
                  record.targetGender.indexOf(value) === 0,
                width: 100,
              },
            ]
          : []),
      ],
    },
    {
      title: "Mapping Status",
      dataIndex: "mappingStatus",
      key: "mappingStatus",
      render: (status: any) => (
        <Tag color={status === "Complete" ? "green" : "red"}>{status}</Tag>
      ),
      width: 100,
      filters: [
        { text: "Complete", value: "Complete" },
        { text: "Pending", value: "Pending" },
      ],
      filterSearch: true,
      onFilter: (value: any, record: any) =>
        record.mappingStatus.indexOf(value) === 0,
      sorter: (a: any, b: any) =>
        a.mappingStatus.localeCompare(b.mappingStatus),
    },
    {
      title: "Supervisor",
      children: [
        {
          title: "Email",
          dataIndex: "supervisorEmail",
          key: "supervisorEmail",
          filters: [
            ...new Set(
              mappingData?.map((target: any) =>
                target.supervisor_email !== null
                  ? target.supervisor_email
                  : "Not mapped"
              )
            ),
          ].map((email) => ({
            text: email,
            value: email,
          })),
          filterSearch: true,
          onFilter: (value: any, record: any) =>
            typeof value === "string" &&
            record.supervisorEmail?.indexOf(value) === 0,
          width: 100,
        },
        {
          title: "Name",
          dataIndex: "supervisorName",
          key: "supervisorName",
          sorter: (a: any, b: any) =>
            a.supervisorName.localeCompare(b.supervisorName),
          filters: [
            ...new Set(
              mappingData?.map((target: any) =>
                target.supervisor_name !== null
                  ? target.supervisor_name
                  : "Not mapped"
              )
            ),
          ].map((name) => ({
            text: name,
            value: name,
          })),
          filterSearch: true,
          onFilter: (value: any, record: any) =>
            typeof value === "string" &&
            record.supervisorName?.indexOf(value) === 0,
          width: 100,
        },
        ...(criteria.includes("Location") && !criteria.includes("Manual")
          ? [
              {
                title: "Location",
                dataIndex: "supervisorLocation",
                key: "supervisorLocation",
                sorter: (a: any, b: any) =>
                  a.supervisorLocation.localeCompare(b.supervisorLocation),
                filters: [
                  ...new Set(
                    mappingData?.map(
                      (target: any) =>
                        target.supervisor_mapping_criteria_values?.other
                          ?.location_name
                    )
                  ),
                ].map((location) => ({
                  text: location,
                  value: location,
                })),
                filterSearch: true,
                onFilter: (value: any, record: any) =>
                  record.supervisorLocation?.indexOf(value) === 0,
                width: 100,
              },
            ]
          : []),
        ...(criteria.includes("Language") && !criteria.includes("Manual")
          ? [
              {
                title: "Language",
                dataIndex: "supervisorLanguage",
                key: "supervisorLanguage",
                sorter: (a: any, b: any) =>
                  a.supervisorLanguage.localeCompare(b.supervisorLanguage),
                filters: [
                  ...new Set(
                    mappingData?.map(
                      (target: any) =>
                        target.supervisor_mapping_criteria_values.criteria
                          ?.Language
                    )
                  ),
                ].map((language) => ({
                  text: language,
                  value: language,
                })),
                filterSearch: true,
                onFilter: (value: any, record: any) =>
                  record.supervisorLanguage?.indexOf(value) === 0,
                width: 100,
              },
            ]
          : []),
        ...(criteria.includes("Gender") && !criteria.includes("Manual")
          ? [
              {
                title: "Gender",
                dataIndex: "supervisorGender",
                key: "supervisorGender",
                sorter: (a: any, b: any) =>
                  a.supervisorGender.localeCompare(b.supervisorGender),
                filters: [
                  ...new Set(
                    mappingData?.map(
                      (target: any) =>
                        target.supervisor_mapping_criteria_values.criteria
                          ?.Gender
                    )
                  ),
                ].map((gender) => ({
                  text: gender,
                  value: gender,
                })),
                filterSearch: true,
                onFilter: (value: any, record: any) =>
                  record.supervisorGender?.indexOf(value) === 0,
                width: 100,
              },
            ]
          : []),
      ],
    },
  ];

  const mappingTableData = mappingData?.map((target: any) => {
    return {
      key: target.target_uid,
      targetID: target.target_id,
      targetUID: target.target_uid,
      targetLocationID: target?.location_id,
      targetLocation: target?.location_name,
      targetLanguage: target?.language,
      targetGender: target?.gender,
      mappingStatus: target.supervisor_email !== null ? "Complete" : "Pending",
      supervisorEmail:
        target.supervisor_email !== null
          ? target.supervisor_email
          : "Not mapped",
      supervisorName:
        target.supervisor_name !== null ? target.supervisor_name : "Not mapped",
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
  };

  const [isEditingOpen, setIsEditingOpen] = useState(false);

  const showDrawer = () => {
    setIsEditingOpen(true);
  };

  const onDrawerClose = () => {
    setIsEditingOpen(false);
  };

  const handleOnEdit = () => {
    if (criteria.includes("Location")) {
      const supervisorLocations = selectedTargetRows.map(
        (target: any) => target.supervisorLocation
      );

      const isSameLocation = new Set(supervisorLocations).size === 1;

      if (!isSameLocation) {
        message.error(
          "You can't map rows with different mapping criteria values together."
        );
        return;
      }
    }

    if (criteria.includes("Language")) {
      const supervisorLanguages = selectedTargetRows.map(
        (target: any) => target.supervisorLanguage
      );

      const isSameLanguage = new Set(supervisorLanguages).size === 1;

      if (!isSameLanguage) {
        message.error(
          "You can't map rows with different mapping criteria values together."
        );
        return;
      }
    }

    if (criteria.includes("Gender")) {
      const supervisorGenders = selectedTargetRows.map(
        (target: any) => target.supervisorGender
      );

      const isSameGender = new Set(supervisorGenders).size === 1;

      if (!isSameGender) {
        message.error(
          "You can't map rows with different mapping criteria values together."
        );
        return;
      }
    }

    setSelectedMappingValue(selectedTargetRows[0].supervisorUID);
    showDrawer();
  };

  const populateMappingStats = (mappingConfig: any) => {
    const mappedData = mappingConfig?.filter(
      (config: any) => config.supervisor_email !== null
    ).length;

    const unmappedData = mappingConfig.length - mappedData;

    dispatch(
      updateMappingStatsSuccess({
        type: "target",
        mapped: mappedData,
        unmapped: unmappedData,
      })
    );
  };

  useEffect(() => {
    return () => {
      dispatch(updateMappingStatsSuccess(null));
    };
  }, [dispatch]);

  useEffect(() => {
    if (formUID) {
      setLoadingMappingConfig(true);
      fetchTargetsMappingConfig(formUID).then((res: any) => {
        if (res?.data?.success) {
          setMappingConfig(res?.data?.data);
          setLoadMappingConfigError("");
        } else {
          const error_message = res.response?.data?.errors?.mapping_errors
            ? res.response?.data?.errors?.mapping_errors
            : res.response?.data?.errors?.message
            ? res.response?.data?.errors?.message
            : "Failed to fetch mapping config";
          message.error(error_message);
          setLoadMappingConfigError(error_message);
        }
        setLoadingMappingConfig(false);
        // Resolve existing mapping notifications
        dispatch(
          resolveSurveyNotification({
            survey_uid: SurveyUID,
            module_id: 17,
            resolution_status: "done",
          })
        );
      });

      if (pageNumber === 2) {
        setLoadingMappingData(true);
        fetchTargetsMapping(formUID).then((res: any) => {
          if (res?.data?.success) {
            setMappingData(res?.data?.data);
            setOriginalMappingData(res?.data?.data);
            populateMappingStats(res?.data?.data);
            setLoadMappingDataError("");
          } else {
            const error_message = res.response?.data?.errors?.mapping_errors
              ? res.response?.data?.errors?.mapping_errors
              : res.response?.data?.errors?.message
              ? res.response?.data?.errors?.message
              : "Failed to fetch mapping";
            message.error(error_message);
            setLoadMappingDataError(error_message);
          }
          setLoadingMappingData(false);
        });
      }

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
  }, [formUID, SurveyUID, criteria, pageNumber]);

  const loading =
    loadingMappingConfig ||
    loadingMappingData ||
    mappingLoading ||
    isSideMenuLoading;

  // State to force table refresh
  const [tableKey, setTableKey] = useState(0);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      {pageNumber === 1 ? (
        <>
          <HeaderContainer>
            <Breadcrumb
              separator=">"
              style={{ fontSize: "16px", color: "#000" }}
              items={[
                {
                  title: "Targets <> Supervisors Mapping Configuration",
                },
              ]}
            />
            <div
              style={{
                display: "flex",
                marginLeft: "auto",
              }}
            >
              <Popconfirm
                title="Delete"
                description="Are you sure you want to delete all mapping config?"
                onConfirm={resetMappingConfig}
                okText="Delete"
                cancelText="No"
              >
                <ResetButton
                  style={{ marginLeft: "auto" }}
                  disabled={
                    criteria.includes("Manual")
                      ? true
                      : loadMappingConfigError &&
                        (mappingConfig?.length === 0 || !mappingConfig)
                      ? true
                      : false
                  }
                >
                  Reset Mapping
                </ResetButton>
              </Popconfirm>
            </div>
          </HeaderContainer>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <MappingWrapper>
              {loadMappingConfigError &&
              (mappingConfig?.length === 0 || !mappingConfig) ? (
                <MappingError
                  mappingName="Target"
                  error={loadMappingConfigError}
                />
              ) : (
                <div>
                  <DescriptionText>
                    Review the mapping of Targets to Supervisors based on{" "}
                    {criteria.join(" and ")}{" "}
                    <Tooltip title="As per mapping criteria selected under module questionnaire">
                      <QuestionCircleOutlined />
                    </Tooltip>
                    {" . "}
                    <DescriptionLink link="https://docs.surveystream.idinsight.io/supervisor_mapping" />
                  </DescriptionText>
                  <MappingTable
                    columns={mappedPairsColumns}
                    dataSource={mappedPairsData}
                    scroll={{ x: "max-content" }}
                    pagination={false}
                    bordered={true}
                  />
                  {unmappedTargets?.length > 0 && (
                    <>
                      <DescriptionText style={{ marginTop: "36px" }}>
                        Targets with the following {criteria.join(" and ")}{" "}
                        criteria couldn’t be mapped to a supervisor, please
                        select alternative mapping values.
                      </DescriptionText>
                      <MappingTable
                        columns={unmappedColumns}
                        dataSource={unmappedPairData}
                        scroll={{
                          x: "max-content",
                          y:
                            unmappedPairData?.length > 5
                              ? "calc(100vh - 400px)"
                              : undefined,
                        }}
                        pagination={false}
                        bordered={true}
                      />
                    </>
                  )}
                  <div style={{ marginTop: "0px", marginBottom: "40px" }}>
                    <Button
                      onClick={() =>
                        navigate(
                          `/survey-information/mapping/target/${SurveyUID}`
                        )
                      }
                    >
                      Cancel
                    </Button>
                    <Button
                      style={{ marginLeft: "20px" }}
                      onClick={handleContinue}
                    >
                      Continue
                    </Button>
                    <CustomBtn
                      style={{ marginLeft: "20px" }}
                      onClick={handleConfigSave}
                      disabled={
                        criteria.includes("Manual") ||
                        !(unmappedPairData?.length > 0)
                      }
                    >
                      Save
                    </CustomBtn>
                  </div>
                </div>
              )}
            </MappingWrapper>
          </div>
        </>
      ) : (
        <>
          <HeaderContainer>
            <Breadcrumb
              separator=">"
              style={{ fontSize: "16px", color: "#000" }}
              items={[
                {
                  title: "Targets <> Supervisors Mapping Configuration",
                  href: `/survey-information/mapping/${mappingName}/${SurveyUID}?form_uid=${formUID}&page=1`,
                },
                {
                  title: "Mapping Data",
                },
              ]}
            />
            {mappingStats !== null ? (
              <MappingStats stats={mappingStats} />
            ) : null}
            <div
              style={{
                display: "flex",
                marginLeft: "auto",
              }}
            >
              <CustomBtn
                style={{ marginLeft: "auto" }}
                onClick={handleOnEdit}
                disabled={selectedTargetRows.length === 0}
              >
                Edit
              </CustomBtn>
            </div>
            {mappingTableData?.length > 0 && (
              <Button
                onClick={() => {
                  // Reset the mapping data to original state
                  setMappingData([...originalMappingData]);
                  // Force table reload by updating key
                  setTableKey((prev) => prev + 1);
                }}
                icon={<ClearOutlined />}
                style={{ marginLeft: 16 }}
              />
            )}
          </HeaderContainer>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <MappingWrapper>
              {loadMappingDataError &&
              (mappingData?.length === 0 || !mappingData) ? (
                <MappingError
                  mappingName="Target"
                  error={loadMappingDataError}
                />
              ) : (
                <div>
                  <MappingTable
                    key={tableKey}
                    columns={targetsMappingColumns}
                    dataSource={mappingTableData}
                    rowSelection={rowSelection}
                    scroll={{ x: "max-content" }}
                    bordered={true}
                    pagination={{
                      position: ["topRight"],
                      pageSize: tablePageSize,
                      pageSizeOptions: [5, 10, 25, 50, 100],
                      showSizeChanger: true,
                      showQuickJumper: true,
                      onShowSizeChange: (_, size) => setTablePageSize(size),
                      style: { color: "#2F54EB" },
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
                          {criteria.includes("Location") && (
                            <p>Target Location:</p>
                          )}
                          {criteria.includes("Language") && (
                            <p>Target Language:</p>
                          )}
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
                              selectedMappingValue(
                                selectedTargetRows[0].supervisorUID
                              );
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
                        <Button onClick={onDrawerClose}>Cancel</Button>
                        <CustomBtn
                          style={{ marginLeft: 16 }}
                          onClick={handleTargetMappingSave}
                        >
                          Save
                        </CustomBtn>
                      </div>
                    </Drawer>
                  )}
                </div>
              )}
            </MappingWrapper>
          </div>
        </>
      )}
    </>
  );
};

export default TargetMapping;
