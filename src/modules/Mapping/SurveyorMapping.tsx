import { useEffect, useState } from "react";
import {
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
  fetchSurveyorsMappingConfig,
  updateSurveyorsMappingConfig,
  deleteSurveyorsMappingConfig,
  fetchUserGenders,
  fetchUserLanguages,
  fetchUserLocations,
  fetchSurveyorsMapping,
  updateSurveyorsMapping,
} from "../../redux/mapping/apiService";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import { CustomBtn, MappingTable, ResetButton } from "./Mapping.styled";
import { useAppDispatch } from "./../../redux/hooks";
import { updateMappingStatsSuccess } from "./../../redux/mapping/mappingSlice";

const { Option } = Select;

interface SurveyorMappingProps {
  formUID: string;
  SurveyUID: string;
  criteria: string[];
}

const SurveyorMapping = ({
  formUID,
  SurveyUID,
  criteria,
}: SurveyorMappingProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [isConfigSetupPage, setIsConfigSetupPage] = useState<boolean>(true);
  const [tablePageSize, setTablePageSize] = useState(5);

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
            title: "Surveyor Location",
            dataIndex: "surveyorLocation",
            key: "surveyorLocation",
          },
        ]
      : []),
    ...(criteria.includes("Language")
      ? [
          {
            title: "Surveyor Language",
            dataIndex: "surveyorLanguage",
            key: "surveyorLanguage",
          },
        ]
      : []),
    ...(criteria.includes("Gender")
      ? [
          {
            title: "Surveyor Gender",
            dataIndex: "surveyorGender",
            key: "surveyorGender",
          },
        ]
      : []),
    {
      title: "Surveyor Count",
      dataIndex: "surveyorCount",
      key: "surveyorCount",
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
            title: "Surveyor Location",
            dataIndex: "surveyorLocation",
            key: "surveyorLocation",
          },
        ]
      : []),
    ...(criteria.includes("Language")
      ? [
          {
            title: "Surveyor Language",
            dataIndex: "surveyorLanguage",
            key: "surveyorLanguage",
          },
        ]
      : []),
    ...(criteria.includes("Gender")
      ? [
          {
            title: "Surveyor Gender",
            dataIndex: "surveyorGender",
            key: "surveyorGender",
          },
        ]
      : []),
    {
      title: "Surveyor Count",
      dataIndex: "surveyorCount",
      key: "surveyorCount",
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
  const mappedSurveyors = mappingConfig?.filter(
    (config: any) => config.supervisor_mapping_criteria_values !== null
  );

  const mappedPairsData = mappedSurveyors?.map((config: any, index: number) => {
    return {
      key: "mappedPair" + index,
      surveyorLocation:
        config.surveyor_mapping_criteria_values.other?.location_name,
      surveyorLanguage:
        config.surveyor_mapping_criteria_values.criteria?.Language,
      surveyorGender: config.surveyor_mapping_criteria_values.criteria?.Gender,
      surveyorCount: config.surveyor_count,
      supervisorLocation:
        config.supervisor_mapping_criteria_values.other?.location_name,
      supervisorLanguage:
        config.supervisor_mapping_criteria_values.criteria?.Language,
      supervisorGender:
        config.supervisor_mapping_criteria_values.criteria?.Gender,
      supervisorCount: config.supervisor_count,
      status: config.mapping_status,
    };
  });

  // Filter out the unmapped surveyors from the mapping config
  // and map the data to the columns for table
  const unmappedSurveyors = mappingConfig?.filter(
    (config: any) => config.supervisor_mapping_criteria_values === null
  );

  const unmappedPairData = unmappedSurveyors?.map(
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
        surveyorLocation:
          config.surveyor_mapping_criteria_values.other.location_name,
        surveyorLocationUID:
          config.surveyor_mapping_criteria_values.criteria.Location,
        surveyorLanguage:
          config.surveyor_mapping_criteria_values.criteria?.Language,
        surveyorGender:
          config.surveyor_mapping_criteria_values.criteria?.Gender,
        surveyorCount: config.surveyor_count,
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
            ? record.surveyorLocationUID
            : type === "Language"
            ? record.surveyorLanguage
            : record.surveyorGender,
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
    for (const record of unmappedPairData) {
      if (record.supervisorCount === null || record.supervisorCount === 0) {
        message.error("Some mapping selections contain no supervisor count");
        return;
      }
    }

    const mappingConfigPayload: any = [];

    // Create the payload for mapped surveyors
    mappedSurveyors.forEach((surveyor: any) => {
      const mappingValues = criteria.map((criterion) => ({
        criteria: criterion,
        value: surveyor.surveyor_mapping_criteria_values.criteria[criterion],
      }));

      const mappedToValues = criteria.map((criterion) => ({
        criteria: criterion,
        value: surveyor.supervisor_mapping_criteria_values.criteria[criterion],
      }));

      mappingConfigPayload.push({
        mapping_values: mappingValues,
        mapped_to: mappedToValues,
      });
    });

    // Create the payload for unmapped surveyors for each criterion
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

    const surveyorsMappingConfigPayload = {
      form_uid: formUID,
      mapping_config: mappingConfigPayload,
    };

    setLoading(true);
    updateSurveyorsMappingConfig(formUID, surveyorsMappingConfigPayload).then(
      (res: any) => {
        if (res?.data?.success || res?.data?.message === "Success") {
          message.success("Mapping updated successfully");
          setLoading(true);
          fetchSurveyorsMappingConfig(formUID).then((res: any) => {
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

  const handleSurveyorMappingSave = () => {
    const mappingsPayload = selectedSurveyorRows?.map((surveyor: any) => {
      return {
        enumerator_uid: surveyor.surveyorUID,
        supervisor_uid: selectedMappingValue,
      };
    });

    if (mappingsPayload.length === 0) {
      message.error("Please select a supervisor to map");
      return;
    }

    setLoading(true);
    updateSurveyorsMapping(formUID, mappingsPayload).then((res: any) => {
      if (res?.data?.success) {
        message.success("Surveyor to Supervisor mapping updated successfully");
        setLoading(true);
        fetchSurveyorsMapping(formUID).then((res: any) => {
          if (res?.data?.success) {
            setMappingData(res?.data?.data);
            populateMappingStats(res?.data?.data);
          } else {
            message.error("Failed to fetch mapping");
          }
          setLoading(false);
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
      setLoading(false);
    });
  };

  const handleContinue = () => {
    setLoading(true);
    fetchSurveyorsMapping(formUID).then((res: any) => {
      if (res?.data?.success) {
        setMappingData(res?.data?.data);
        populateMappingStats(res?.data?.data);
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
    deleteSurveyorsMappingConfig(formUID).then((res: any) => {
      if (res?.data?.success) {
        message.success("Mapping reset successfully");
        setLoading(true);
        fetchSurveyorsMappingConfig(formUID).then((res: any) => {
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

  const surveyorsMappingColumns: any = [
    {
      title: "Surveyor ID",
      dataIndex: "surveyorID",
      key: "surveyorID",
      sorter: (a: any, b: any) => a.surveyorID.localeCompare(b.surveyorID),
    },
    {
      title: "Surveyor Name",
      dataIndex: "surveyorName",
      key: "surveyorName",
      sorter: (a: any, b: any) => a.surveyorName.localeCompare(b.surveyorName),
    },
    ...(criteria.includes("Location") || criteria.includes("Manual")
      ? [
          {
            title: "Surveyor Location ID",
            dataIndex: "surveyorLocationID",
            key: "surveyorLocationID",
            sorter: (a: any, b: any) =>
              a.surveyorLocationID.localeCompare(b.surveyorLocationID),
            filters: [
              ...Array.from(
                new Set(
                  mappingData?.map((surveyor: any) => surveyor.location_id[0])
                )
              ),
            ].map((location) => ({
              text: location,
              value: location,
            })),
            onFilter: (value: any, record: { surveyorLocationID: string }) =>
              record.surveyorLocationID.indexOf(value) === 0,
          },
          {
            title: "Surveyor Location",
            dataIndex: "surveyorLocation",
            key: "surveyorLocation",
            sorter: (a: any, b: any) =>
              a.surveyorLocation.localeCompare(b.surveyorLocation),
            filters: [
              ...Array.from(
                new Set(
                  mappingData?.map((surveyor: any) => surveyor.location_name[0])
                )
              ),
            ].map((location) => ({
              text: location,
              value: location,
            })),
            onFilter: (value: any, record: { surveyorLocation: string }) =>
              record.surveyorLocation.indexOf(value) === 0,
          },
        ]
      : []),
    ...(criteria.includes("Language") || criteria.includes("Manual")
      ? [
          {
            title: "Surveyor Language",
            dataIndex: "surveyorLanguage",
            key: "surveyorLanguage",
            sorter: (a: any, b: any) =>
              a.surveyorLanguage.localeCompare(b.surveyorLanguage),
            filters: [
              ...Array.from(
                new Set(
                  mappingData?.map(
                    (surveyor: { language: string }) => surveyor.language
                  )
                )
              ),
            ].map((language) => ({
              text: language,
              value: language,
            })),
            onFilter: (value: any, record: { surveyorLanguage: string }) =>
              record.surveyorLanguage.indexOf(value) === 0,
          },
        ]
      : []),
    ...(criteria.includes("Gender") || criteria.includes("Manual")
      ? [
          {
            title: "Surveyor Gender",
            dataIndex: "surveyorGender",
            key: "surveyorGender",
            sorter: (a: any, b: any) =>
              a.surveyorGender.localeCompare(b.surveyorGender),
            filters: [
              ...Array.from(
                new Set(
                  mappingData?.map(
                    (surveyor: { gender: string }) => surveyor.gender
                  )
                )
              ),
            ].map((gender) => ({
              text: gender,
              value: gender,
            })),
            onFilter: (value: any, record: { surveyorGender: string }) =>
              record.surveyorGender.indexOf(value) === 0,
          },
        ]
      : []),
    {
      title: "Supervisor Email",
      dataIndex: "supervisorEmail",
      key: "supervisorEmail",
      sorter: (a: any, b: any) =>
        a.supervisorEmail.localeCompare(b.supervisorEmail),
      filters: [
        ...Array.from(
          new Set(
            mappingData?.map((surveyor: { supervisor_email: string }) =>
              surveyor.supervisor_email !== null
                ? surveyor.supervisor_email
                : "Not mapped"
            )
          )
        ),
      ].map((email) => ({
        text: email,
        value: email,
      })),
      onFilter: (value: any, record: any) =>
        typeof value === "string" &&
        record.supervisorEmail?.indexOf(value) === 0,
    },
    {
      title: "Supervisor Name",
      dataIndex: "supervisorName",
      key: "supervisorName",
      sorter: (a: any, b: any) =>
        a.supervisorName.localeCompare(b.supervisorName),
      filters: [
        ...Array.from(
          new Set(
            mappingData?.map((surveyor: any) =>
              surveyor.supervisor_name !== null
                ? surveyor.supervisor_name
                : "Not mapped"
            )
          )
        ),
      ].map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value: any, record: any) =>
        typeof value === "string" &&
        record.supervisorName?.indexOf(value) === 0,
    },
    ...(criteria.includes("Location") && !criteria.includes("Manual")
      ? [
          {
            title: "Supervisor Location",
            dataIndex: "supervisorLocation",
            key: "supervisorLocation",
            sorter: (a: any, b: any) =>
              a.supervisorLocation.localeCompare(b.supervisorLocation),
            filters: [
              ...Array.from(
                new Set(
                  mappingData?.map(
                    (surveyor: any) =>
                      surveyor.supervisor_mapping_criteria_values.other
                        ?.location_name
                  )
                )
              ),
            ].map((location) => ({
              text: location,
              value: location,
            })),
            onFilter: (value: any, record: any) =>
              record.supervisorLocation.indexOf(value) === 0,
          },
        ]
      : []),
    ...(criteria.includes("Language") && !criteria.includes("Manual")
      ? [
          {
            title: "Supervisor Language",
            dataIndex: "supervisorLanguage",
            key: "supervisorLanguage",
            sorter: (a: any, b: any) =>
              a.supervisorLanguage.localeCompare(b.supervisorLanguage),
            filters: [
              ...Array.from(
                new Set(
                  mappingData?.map(
                    (surveyor: any) =>
                      surveyor.supervisor_mapping_criteria_values.criteria
                        ?.Language
                  )
                )
              ),
            ].map((language) => ({
              text: language,
              value: language,
            })),
            onFilter: (value: any, record: any) =>
              record.supervisorLanguage.indexOf(value) === 0,
          },
        ]
      : []),
    ...(criteria.includes("Gender") && !criteria.includes("Manual")
      ? [
          {
            title: "Supervisor Gender",
            dataIndex: "supervisorGender",
            key: "supervisorGender",
            sorter: (a: any, b: any) =>
              a.supervisorGender.localeCompare(b.supervisorGender),
            filters: [
              ...Array.from(
                new Set(
                  mappingData?.map(
                    (surveyor: any) =>
                      surveyor.supervisor_mapping_criteria_values.criteria
                        ?.Gender
                  )
                )
              ),
            ].map((gender) => ({
              text: gender,
              value: gender,
            })),
            onFilter: (value: any, record: any) =>
              record.supervisorGender.indexOf(value) === 0,
          },
        ]
      : []),
  ];

  const mappingTableData = mappingData?.map((surveyor: any) => {
    return {
      key: surveyor.enumerator_uid,
      surveyorID: surveyor.enumerator_id,
      surveyorName: surveyor.name,
      surveyorUID: surveyor.enumerator_uid,
      surveyorLocationID: surveyor?.location_id?.[0],
      surveyorLocation: surveyor?.location_name?.[0],
      surveyorLanguage: surveyor?.language,
      surveyorGender: surveyor?.gender,
      supervisorEmail:
        surveyor.supervisor_email !== null
          ? surveyor.supervisor_email
          : "Not mapped",
      supervisorName:
        surveyor.supervisor_name !== null
          ? surveyor.supervisor_name
          : "Not mapped",
      supervisorUID: surveyor.supervisor_uid,
      supervisorLocation:
        surveyor.supervisor_mapping_criteria_values.other?.location_name,
      supervisorLocationUID:
        surveyor.supervisor_mapping_criteria_values.criteria?.Location,
      supervisorLanguage:
        surveyor.supervisor_mapping_criteria_values.criteria?.Language,
      supervisorGender:
        surveyor.supervisor_mapping_criteria_values.criteria?.Gender,
    };
  });

  const getSupervisorOptionList = () => {
    const userList: any = [];

    if (criteria.includes("Location")) {
      userLocations?.map((user: any) => {
        if (
          user.location_uid === selectedSurveyorRows[0].supervisorLocationUID
        ) {
          userList.push({
            user_uid: user.user_uid,
            user_name: user.user_name,
          });
        }
      });
    }

    if (criteria.includes("Language")) {
      userLanguages?.map((user: any) => {
        if (user.language === selectedSurveyorRows[0].supervisorLanguage) {
          userList.push({
            user_uid: user.user_uid,
            user_name: user.user_name,
          });
        }
      });
    }

    if (criteria.includes("Gender")) {
      userLanguages?.map((user: any) => {
        if (user.language === selectedSurveyorRows[0].supervisorGender) {
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

  const [selectedSurveyorRows, setSelectedSurveyorRows] = useState<any>([]);

  const rowSelection = {
    selectedSurveyorRows,
    onSelect: (record: any, selected: any, selectedRow: any) => {
      setSelectedSurveyorRows(selectedRow);
    },
    onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {
      setSelectedSurveyorRows(selectedRows);
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
      const supervisorLocations = selectedSurveyorRows.map(
        (surveyor: any) => surveyor.supervisorLocation
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
      const supervisorLanguages = selectedSurveyorRows.map(
        (surveyor: any) => surveyor.supervisorLanguage
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
      const supervisorGenders = selectedSurveyorRows.map(
        (surveyor: any) => surveyor.supervisorGender
      );

      const isSameGender = new Set(supervisorGenders).size === 1;

      if (!isSameGender) {
        message.error(
          "You can't map rows with different mapping criteria values together."
        );
        return;
      }
    }

    showDrawer();
  };

  const populateMappingStats = (mappingConfig: any) => {
    const mappedData = mappingConfig?.filter(
      (config: any) => config.supervisor_email !== null
    ).length;

    const unmappedData = mappingConfig.length - mappedData;

    dispatch(
      updateMappingStatsSuccess({
        type: "surveyor",
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
      setLoading(true);
      fetchSurveyorsMappingConfig(formUID).then((res: any) => {
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
              <ResetButton
                style={{ marginLeft: "auto" }}
                disabled={criteria.includes("Manual")}
              >
                Reset Mapping
              </ResetButton>
            </Popconfirm>
          </div>
          <MappingTable
            columns={mappedPairsColumns}
            dataSource={mappedPairsData}
            pagination={false}
          />
          {unmappedSurveyors?.length > 0 && (
            <>
              <p style={{ marginTop: "36px", fontWeight: "bold" }}>
                There is no mapping available for below listed Surveyor, please
                map them manually:
              </p>
              <MappingTable
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
            <Button onClick={handleContinue}>Continue</Button>
            <Button style={{ marginLeft: "10px" }} onClick={() => navigate(0)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {selectedSurveyorRows.length > 0 ? (
              <Button
                type="primary"
                style={{ marginLeft: "auto" }}
                onClick={handleOnEdit}
              >
                Edit
              </Button>
            ) : null}
          </div>
          <MappingTable
            columns={surveyorsMappingColumns}
            dataSource={mappingTableData}
            rowSelection={rowSelection}
            scroll={criteria.includes("Manual") ? { x: 1500 } : {}}
            pagination={{
              pageSize: tablePageSize,
              pageSizeOptions: ["5", "10", "20", "50", "100"],
              showSizeChanger: true,
              onShowSizeChange: (current, size) => setTablePageSize(size),
            }}
          />
          {selectedSurveyorRows.length > 0 && (
            <Drawer
              title="Edit Surveyor to Supervisor Mapping"
              onClose={onDrawerClose}
              open={isEditingOpen}
              width={480}
            >
              <Row>
                <Col span={8}>
                  {criteria.includes("Location") && <p>Surveyor Location:</p>}
                  {criteria.includes("Language") && <p>Surveyor Language:</p>}
                  {criteria.includes("Gender") && <p>Surveyor Gender:</p>}
                  {criteria.includes("Manual") && <p>Surveyor count:</p>}
                </Col>
                <Col span={12}>
                  {criteria.includes("Location") && (
                    <p>{selectedSurveyorRows[0].surveyorLocation}</p>
                  )}
                  {criteria.includes("Language") && (
                    <p>{selectedSurveyorRows[0].surveyorLanguage}</p>
                  )}
                  {criteria.includes("Gender") && (
                    <p>{selectedSurveyorRows[0].surveyorGender}</p>
                  )}
                  {criteria.includes("Manual") && (
                    <p>{selectedSurveyorRows.length}</p>
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
                        selectedSurveyorRows[0].supervisorUID
                      );
                      return selectedSurveyorRows[0].supervisorUID;
                    }}
                    value={selectedMappingValue}
                    onChange={(value) => setSelectedMappingValue(value)}
                  >
                    {getSupervisorOptionList()}
                  </Select>
                </Col>
              </Row>
              <div style={{ marginTop: 16 }}>
                <Button type="primary" onClick={handleSurveyorMappingSave}>
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

export default SurveyorMapping;
