import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Divider, Modal, Radio, Space, message, Tag } from "antd"; // Add Tag import
import { useCSVDownloader } from "react-papaparse";
import { HeaderContainer, Title } from "../../../../shared/Nav.styled";
import SideMenu from "../../SideMenu";
import {
  EnumeratorsHomeFormWrapper,
  EnumeratorsTable,
} from "./EnumeratorsHome.styled";

import EnumeratorsCountBox from "../../../../components/EnumeratorsCountBox";
import RowEditingModal from "./RowEditingModal";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import {
  setEnumeratorColumnMapping,
  setLoading,
  setLocations,
} from "../../../../redux/enumerators/enumeratorsSlice";
import { getSurveyBasicInformation } from "../../../../redux/surveyConfig/surveyConfigActions";
import { getSurveyCTOForm } from "../../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { getEnumerators } from "../../../../redux/enumerators/enumeratorsActions";

import EnumeratorsReupload from "./../EnumeratorsReupload";
import EnumeratorsRemap from "../EnumeratorsRemap";
import { CustomBtn, GlobalStyle } from "../../../../shared/Global.styled";
import Container from "../../../../components/Layout/Container";
import { getSurveyLocationsLong } from "../../../../redux/surveyLocations/surveyLocationsActions";
import { ClearOutlined } from "@ant-design/icons";

// Add these interfaces near the top of the file after imports
interface TableColumnType {
  title: string;
  dataIndex: string;
  width: number;
  ellipsis: boolean;
  render?: (value: any) => React.ReactNode;
  sorter?: (a: any, b: any) => number;
  filters?: { text: string; value: string }[];
  onFilter?: (value: any, record: any) => boolean;
  filterSearch?: boolean;
}

function EnumeratorsHome() {
  const navigate = useNavigate();

  const { CSVDownloader, Type } = useCSVDownloader();

  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };
  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };

  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(
    (state: RootState) => state.enumerators.loading
  );
  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );
  const enumeratorList = useAppSelector(
    (state: RootState) => state.enumerators.enumeratorList
  );
  const surveys = useAppSelector((state: RootState) => state.surveys);

  const { loading: isSideMenuLoading } = useAppSelector(
    (state: RootState) => state.surveyConfig
  );

  const [activeEnums, setActiveEnums] = useState<number>(0);
  const [droppedEnums, setDroppedEnums] = useState<number>(0);
  const [inactiveEnums, setInactiveEnums] = useState<number>(0);
  const locations = useAppSelector(
    (state: RootState) => state.enumerators.locations
  );

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editData, setEditData] = useState<boolean>(false);
  const [fieldData, setFieldData] = useState<any>([]);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(10);
  const [dataTableColumn, setDataTableColumn] = useState<TableColumnType[]>([]);
  const [tableDataSource, setTableDataSource] = useState<any>([]);
  const [PrimeGeoLevelUID, setPrimeGeoLevelUID] = useState<any>(null);
  const [primeLocationName, setPrimeLocationName] = useState<any>(null);

  // Add a new loading state for the table specifically
  const [tableLoading, setTableLoading] = useState<boolean>(true);

  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});
  const [sortedInfo, setSortedInfo] = useState<Record<string, any>>({});

  const fetchSurveyInfo = async () => {
    // Fetch survey information to get prime_geo_level_uid
    const survey = await dispatch(getSurveyBasicInformation({ survey_uid }));
    if (survey.payload.prime_geo_level_uid !== undefined) {
      setPrimeGeoLevelUID(survey.payload.prime_geo_level_uid);
    } else {
      setPrimeGeoLevelUID(0);
    }
  };

  // Row selection state and handler

  const [selectedRows, setSelectedRows] = useState<any>([]);

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any) => {
    const selectedEnumeratorIds = selectedRows.map(
      (row: any) => row.enumerator_id
    );
    const selectedEnumeratorData = enumeratorList.filter((row: any) =>
      selectedEnumeratorIds.includes(row.enumerator_id)
    );
    setSelectedRows(selectedEnumeratorData);
    setEditMode(selectedEnumeratorData.length > 0);
  };

  const rowSelection = {
    selectedRows,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRows.length > 0;

  // Modify onEditDataHandler to handle fields setup
  const onEditDataHandler = async () => {
    if (!hasSelected) {
      message.error("No row selected for editing");
      return;
    }
    // Check if selected row has surveyor_locations or monitor_locations
    const hasSurveyorLocations =
      selectedRows[0].surveyor_locations?.length > 0 ||
      selectedRows[0].monitor_locations?.length > 0;

    // Pre-filter fields
    const fieldsToExclude = [
      "status",
      "enumerator_uid",
      "monitor_locations",
      "surveyor_locations",
      "monitor_status",
      "surveyor_status",
    ];

    const filteredFields = Object.keys({ ...selectedRows[0] })
      .filter((field) => !fieldsToExclude.includes(field))
      .flatMap((field) => {
        if (field === "custom_fields") {
          if (
            selectedRows[0][field] &&
            typeof selectedRows[0][field] === "object"
          ) {
            const customFields = selectedRows[0][field];
            return Object.keys(customFields)
              .filter((key) => key !== "column_mapping")
              .map((key) => ({
                labelKey: key,
                label: `custom_fields.${key}`,
              }));
          }
          return [];
        }
        return [
          {
            labelKey: field,
            label: field,
          },
        ];
      });

    // Add location only if surveyor_locations exist
    if (hasSurveyorLocations) {
      filteredFields.push({
        labelKey: "location",
        label: `${primeLocationName} Name`,
      });

      // Fetch locations in background
      if (PrimeGeoLevelUID) {
        dispatch(
          getSurveyLocationsLong({
            survey_uid: survey_uid || "",
            geo_level_uid: PrimeGeoLevelUID,
          })
        ).then((response) => {
          if (response.payload) {
            dispatch(setLocations(response.payload));
          }
        });
      }
    }

    setFieldData(filteredFields);
    setEditData(true);
  };

  const onEditingCancel = () => {
    setEditData(false);
  };

  const onEditingUpdate = async () => {
    if (form_uid) {
      await getEnumeratorsList(form_uid);
    }
    setEditData(false);
  };

  const handleFormUID = async () => {
    if (form_uid == "" || form_uid == undefined) {
      try {
        dispatch(setLoading(true));
        const sctoForm = await dispatch(
          getSurveyCTOForm({ survey_uid: survey_uid })
        );
        if (sctoForm?.payload[0]?.form_uid) {
          navigate(
            `/survey-information/enumerators/${survey_uid}/${sctoForm?.payload[0]?.form_uid}`
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
  const getEnumeratorsList = async (
    form_uid: string,
    enumerator_type?: string
  ) => {
    setTableLoading(true);
    try {
      const enumeratorRes = await dispatch(
        getEnumerators(
          enumerator_type
            ? { formUID: form_uid, enumeratorType: enumerator_type }
            : { formUID: form_uid }
        )
      );

      if (enumeratorRes.payload.status == 200) {
        const originalData = enumeratorRes.payload.data.data;
        // Handle empty data case immediately
        if (!originalData || originalData.length == 0) {
          setTableLoading(false); // Stop loading before navigation
          navigate(
            `/survey-information/enumerators/upload/${survey_uid}/${form_uid}`
          );
          message.info("No enumerators found. Kindly upload the enumerators.");
          return;
        }

        // Initialize counters
        let activeCount = 0;
        let inactiveCount = 0;
        let droppedCount = 0;

        // Iterate through the data
        const updatedData = originalData.map((enumerator: Enumerator) => {
          const surveyorLocations = [
            ...(enumerator.surveyor_locations || []),
            ...(enumerator.monitor_locations || []),
          ].filter(
            (locations, index, self) =>
              index ===
              self.findIndex(
                (t) => JSON.stringify(t) === JSON.stringify(locations)
              )
          );

          // Calculate enumerator_type and status
          let enumerator_type = "";
          if (
            enumerator.surveyor_status !== null &&
            enumerator.monitor_status !== null
          ) {
            enumerator_type = "Surveyor, Monitor";
          } else if (enumerator.surveyor_status !== null) {
            enumerator_type = "Surveyor";
          } else if (enumerator.monitor_status !== null) {
            enumerator_type = "Monitor";
          }

          const status =
            enumerator.surveyor_status || enumerator.monitor_status || "N/A";

          // Process locations
          const flattenedLocations = ([] as Location[]).concat(
            ...surveyorLocations
          );
          const matchingLocations = flattenedLocations.filter(
            (location: Location) => location.geo_level_uid === PrimeGeoLevelUID
          );

          // Update counters
          switch (status?.toLowerCase()) {
            case "active":
              activeCount++;
              break;
            case "temp. inactive":
              inactiveCount++;
              break;
            case "dropout":
              droppedCount++;
              break;
          }

          return {
            ...enumerator,
            enumerator_type,
            status,
            location:
              matchingLocations.map((loc) => loc.location_name).join(", ") ||
              null,
            location_uid:
              matchingLocations.map((loc) => loc.location_uid).join(", ") ||
              null,
            location_id:
              matchingLocations.map((loc) => loc.location_id).join(", ") ||
              null,
          };
        });

        setActiveEnums(activeCount);
        setInactiveEnums(inactiveCount);
        setDroppedEnums(droppedCount);

        const columnsToExclude = [
          "enumerator_uid",
          "surveyor_status",
          "monitor_status",
          "surveyor_locations",
          "monitor_locations",
        ];
        if (originalData[0]?.custom_fields?.column_mapping) {
          dispatch(
            setEnumeratorColumnMapping(
              originalData[0]?.custom_fields?.column_mapping
            )
          );
        } else {
          const columnMapping: any = {};

          for (const key in originalData[0]) {
            if (
              Object.prototype.hasOwnProperty.call(originalData[0], key) &&
              key !== "custom_fields" &&
              key !== "surveyor_locations" &&
              !columnsToExclude.includes(key)
            ) {
              columnMapping[key] = key;
            }
          }

          if (
            originalData[0].surveyor_locations &&
            originalData[0].surveyor_locations.length > 0
          ) {
            columnMapping["location"] = "location";
            columnMapping["location_id"] = "location_id";
          }

          dispatch(setEnumeratorColumnMapping(columnMapping));
        }
        // Check if any enumerator has surveyor_locations
        // Handle surveyor_locations separately
        const hasSurveyorLocations = originalData.some(
          (enumerator: any) =>
            enumerator.surveyor_locations?.length > 0 ||
            enumerator.monitor_locations?.length > 0
        );
        const primeLocationName =
          originalData[0].surveyor_locations?.[0]?.find(
            (loc: any) => loc.geo_level_uid === PrimeGeoLevelUID
          )?.geo_level_name ||
          originalData[0].monitor_locations?.[0]?.find(
            (loc: any) => loc.geo_level_uid === PrimeGeoLevelUID
          )?.geo_level_name;

        setPrimeLocationName(primeLocationName);
        // Define column mappings
        let columnMappings: TableColumnType[] = Object.keys(originalData[0])
          .filter((column) => !columnsToExclude.includes(column))
          .filter((column) =>
            originalData.some(
              (row: any) => row[column] !== null && column !== "custom_fields"
            )
          )
          .map((column) => ({
            title: column,
            dataIndex: column,
            width: 140,
            ellipsis: false,
          }));

        columnMappings.push({
          title: "Enumerator Type",
          dataIndex: "enumerator_type",
          width: 150,
          ellipsis: false,
        });

        columnMappings.push({
          title: "Status",
          dataIndex: "status",
          width: 150,
          ellipsis: false,
          render: (status: string) => {
            const color =
              {
                active: "green",
                dropout: "red",
              }[status?.toLowerCase()] || "default";
            return <Tag color={color}>{status}</Tag>;
          },
        } as TableColumnType);

        // Only add location columns if surveyor_locations exist
        if (hasSurveyorLocations) {
          columnMappings.push({
            title: `${primeLocationName} ID`,
            dataIndex: "location_id",
            width: 150,
            ellipsis: false,
          });
          columnMappings.push({
            // this title should be e.g. District Name or county name depending on the key location_name
            title: `${primeLocationName} Name`,
            dataIndex: "location",
            width: 150,
            ellipsis: false,
          });
        }

        // Map the data with locations
        interface Location {
          geo_level_uid: number;
          location_name: string;
          location_uid: string;
          location_id: string;
        }

        interface Enumerator {
          surveyor_locations: Location[][];
          [key: string]: any;
        }

        const updatedDataWithCustomFields = updatedData.map(
          (enumerator: Enumerator) => {
            const surveyorLocations = [
              ...(enumerator.surveyor_locations || []),
              ...(enumerator.monitor_locations || []),
            ].filter(
              (locations, index, self) =>
                index ===
                self.findIndex(
                  (t) => JSON.stringify(t) === JSON.stringify(locations)
                )
            );

            // Flatten the array of surveyor locations arrays
            const flattenedLocations = ([] as Location[]).concat(
              ...surveyorLocations
            );

            // Find all matching locations
            const matchingLocations = flattenedLocations.filter(
              (location: Location) =>
                location.geo_level_uid === PrimeGeoLevelUID
            );

            return {
              ...enumerator,
              location:
                matchingLocations.map((loc) => loc.location_name).join(", ") ||
                null,
              location_uid:
                matchingLocations.map((loc) => loc.location_uid).join(", ") ||
                null,
              location_id:
                matchingLocations.map((loc) => loc.location_id).join(", ") ||
                null,
            };
          }
        );

        const customFieldsSet = new Set(); // Create a set to track unique custom fields
        const customFields = updatedDataWithCustomFields.reduce(
          (acc: any, row: any) => {
            if (row.custom_fields && typeof row.custom_fields === "object") {
              for (const key in row.custom_fields) {
                if (
                  row.custom_fields[key] !== null &&
                  !customFieldsSet.has(key) &&
                  key !== "column_mapping"
                ) {
                  customFieldsSet.add(key);
                  acc.push({
                    title: key,
                    dataIndex: `custom_fields.${key}`,
                    width: 150,
                    ellipsis: false,
                  });
                }
              }
            }
            return acc;
          },
          []
        );

        columnMappings = columnMappings.concat(customFields);

        const tableDataSource = updatedDataWithCustomFields.map(
          (item: any, index: any) => {
            const rowData: Record<string, any> = {}; // Use index signature
            for (const mapping of columnMappings) {
              const { title, dataIndex } = mapping;

              // Check if the mapping is for custom_fields
              if (dataIndex.startsWith("custom_fields.")) {
                const customFieldKey = dataIndex.split(".")[1];
                if (
                  item.custom_fields &&
                  item.custom_fields[customFieldKey] !== null
                ) {
                  rowData[dataIndex] = item.custom_fields[customFieldKey];
                } else {
                  rowData[dataIndex] = null;
                }
              } else {
                rowData[dataIndex] = item[dataIndex];
              }
            }

            return {
              key: index,
              ...rowData,
            };
          }
        );
        setDataTableColumn(
          columnMappings.map((col) => ({
            ...col,
            title: col.title
              .split(/[_\s]+/)
              .map((word) =>
                word.toLowerCase() === "id"
                  ? "ID"
                  : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" "),
            sorter: (a: any, b: any) => {
              const valueA = a[col.dataIndex];
              const valueB = b[col.dataIndex];
              if (typeof valueA === "string" && typeof valueB === "string") {
                return valueA.localeCompare(valueB);
              }
              return valueA - valueB;
            },
            ...(!col.dataIndex.startsWith("custom_fields.") && {
              filterSearch: true,
              filters: Array.from(
                new Set(
                  tableDataSource
                    .flatMap((item: any) => {
                      if (
                        col.dataIndex === "location_id" &&
                        item[col.dataIndex]
                      ) {
                        return item[col.dataIndex]
                          .split(",")
                          .map((v: any) => v.trim());
                      }
                      return item[col.dataIndex];
                    })
                    .filter((item: any) => item !== null && item !== undefined)
                )
              ).map((value: any) => ({
                text: value,
                value: value,
              })),
              onFilter: (value: any, record: any) =>
                col.dataIndex === "location_id"
                  ? record[col.dataIndex]
                      ?.split(",")
                      .map((v: any) => v.trim())
                      .includes(value)
                  : record[col.dataIndex]
                      ?.toString()
                      .toLowerCase()
                      .includes(value.toString().toLowerCase()),
            }),
          }))
        );

        setTableDataSource(tableDataSource);
      } else {
        message.error(
          "Enumerators failed to load, kindly reload to try again."
        );
      }
    } catch (error) {
      console.error("Error loading enumerators:", error);
      message.error("Failed to load enumerators");
    } finally {
      setTableLoading(false);
    }
  };

  /*
   * New design configs
   */
  const [screenMode, setScreenMode] = useState<string>("manage");
  const [newEnumModal, setNewEnumModal] = useState<boolean>(false);

  // Mode: fresh or append
  const [newEnumMode, setNewEnumMode] = useState<string>("");

  const [isEnumInUse, setIsEnumUse] = useState<boolean>(false);

  const handleNewEnumMode = () => {
    // Emit error if no new enumerator mode is selected
    if (newEnumMode === "") {
      message.error("Please select the mode to add new enumerators.");
      return;
    }

    // Redirect to upload fresh enums, in case of fresh upload, otherwise start append mode
    if (newEnumMode === "overwrite") {
      navigate(
        `/survey-information/enumerators/upload/${survey_uid}/${form_uid}`
      );
      return;
    } else if (newEnumMode === "merge") {
      setScreenMode("reupload");
    }

    setNewEnumModal(false);
  };

  const handlerAddEnumBtn = () => {
    if (tableDataSource.length > 0) {
      setNewEnumModal(true);
    } else {
      navigate(
        `/survey-information/enumerators/upload/${survey_uid}/${form_uid}`
      );
    }
  };

  const handleClearFiltersAndSort = async () => {
    setFilteredInfo({});
    setSortedInfo({});
    if (form_uid) {
      await getEnumeratorsList(form_uid);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (screenMode !== "manage") {
        setTableLoading(false);
        return;
      }

      try {
        // Only start loading when we're actually going to fetch data
        // Only set loading and fetch data when we have all prerequisites
        if (form_uid) {
          if (!PrimeGeoLevelUID) {
            await fetchSurveyInfo();
          }
          setTableLoading(true);
          await getEnumeratorsList(form_uid);
          return;
        } else {
          await handleFormUID();
          return;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setTableLoading(false);
      }
    };

    fetchData();
  }, [form_uid, PrimeGeoLevelUID, screenMode]);

  return (
    <>
      <GlobalStyle />

      <Container surveyPage={true} />
      <HeaderContainer>
        <Title>Enumerators</Title>
        <EnumeratorsCountBox
          active={activeEnums}
          dropped={droppedEnums}
          inactive={inactiveEnums}
        />
        {!(isLoading || isSideMenuLoading) && screenMode == "manage" ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  marginLeft: "auto",
                  color: "#2F54EB",
                }}
              >
                <CustomBtn
                  type="primary"
                  style={{
                    marginRight: 15,
                    backgroundColor: editMode ? "#2f54eB" : "#d9d9d9",
                    borderColor: editMode ? "#2f54eB" : "#d9d9d9",
                  }}
                  onClick={() => onEditDataHandler()}
                  disabled={editMode ? false : true}
                >
                  Edit
                </CustomBtn>
                <CustomBtn
                  onClick={handlerAddEnumBtn}
                  type="primary"
                  style={{ marginRight: 15 }}
                >
                  Add Enumerators
                </CustomBtn>
                <CSVDownloader
                  data={tableDataSource}
                  filename={"enumerators.csv"}
                >
                  <CustomBtn type="primary" style={{ marginRight: 15 }}>
                    Download CSV
                  </CustomBtn>
                </CSVDownloader>
                <Button
                  onClick={handleClearFiltersAndSort}
                  style={{
                    cursor: "pointer",
                    marginRight: 15,
                    padding: "8px 16px",
                    borderRadius: "5px",
                    fontSize: "14px",
                  }}
                  disabled={
                    Object.keys(filteredInfo).length === 0 &&
                    Object.keys(sortedInfo).length === 0
                  }
                  icon={<ClearOutlined />}
                />
              </div>
            </div>
          </>
        ) : null}
      </HeaderContainer>
      {isLoading || isSideMenuLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu />
          {screenMode === "manage" ? (
            <>
              <EnumeratorsHomeFormWrapper>
                <br />
                <EnumeratorsTable
                  loading={tableLoading}
                  rowSelection={rowSelection}
                  columns={dataTableColumn}
                  dataSource={tableDataSource}
                  scroll={{ x: "max-content" }}
                  bordered={true}
                  pagination={{
                    position: ["topRight"],
                    pageSize: paginationPageSize,
                    pageSizeOptions: [5, 10, 25, 50, 100],
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onShowSizeChange: (_, size) => setPaginationPageSize(size),
                    style: { color: "#2F54EB" },
                  }}
                  onChange={(pagination, filters, sorter) => {
                    setFilteredInfo(filters);
                    setSortedInfo(sorter);
                  }}
                />
                {editData ? (
                  <RowEditingModal
                    data={selectedRows}
                    fields={fieldData}
                    onCancel={onEditingCancel}
                    onUpdate={onEditingUpdate}
                    editMode={editMode}
                    survey_uid={survey_uid}
                    locations={locations}
                    primeLocationName={primeLocationName}
                  />
                ) : null}
              </EnumeratorsHomeFormWrapper>
              <Modal
                title="Add Enumerators"
                open={newEnumModal}
                onOk={handleNewEnumMode}
                okText="Continue"
                onCancel={() => setNewEnumModal(false)}
              >
                <Divider style={{ margin: "0" }} />
                <p>Please select how you want to proceed:</p>
                <Radio.Group
                  style={{ marginBottom: 20 }}
                  onChange={(e) => setNewEnumMode(e.target.value)}
                  value={newEnumMode}
                >
                  <Space direction="vertical">
                    <Radio value="merge">
                      I want to add new enumerators / columns
                    </Radio>
                    <Radio value="overwrite" disabled={isEnumInUse}>
                      <span>
                        I want to start afresh. ( This action will delete
                        previously uploaded enumerators as well as assignments.){" "}
                      </span>
                    </Radio>
                  </Space>
                </Radio.Group>
              </Modal>
            </>
          ) : null}
          {screenMode === "reupload" ? (
            <EnumeratorsReupload setScreenMode={setScreenMode} />
          ) : null}
          {screenMode === "remap" ? (
            <EnumeratorsRemap setScreenMode={setScreenMode} />
          ) : null}
        </div>
      )}
    </>
  );
}

export default EnumeratorsHome;
