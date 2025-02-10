import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Divider, Modal, Radio, Space, message } from "antd";
import { useCSVDownloader } from "react-papaparse";
import { HeaderContainer, Title } from "../../../../shared/Nav.styled";
import SideMenu from "../../SideMenu";
import {
  EnumeratorsHomeFormWrapper,
  EnumeratorsTable,
} from "./EnumeratorsHome.styled";
import {
  PlusOutlined,
  DownloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
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
import { GlobalStyle } from "../../../../shared/Global.styled";
import Container from "../../../../components/Layout/Container";
import { use } from "chai";
import { getSurveyLocationsLong } from "../../../../redux/surveyLocations/surveyLocationsActions";

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

  const [activeEnums, setActiveEnums] = useState<number>(0);
  const [droppedEnums, setDroppedEnums] = useState<number>(0);
  const [inactiveEnums, setInactiveEnums] = useState<number>(0);
  const locations = useAppSelector(
    (state: RootState) => state.enumerators.locations
  );

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editData, setEditData] = useState<boolean>(false);
  const [fieldData, setFieldData] = useState<any>([]);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);
  const [dataTableColumn, setDataTableColumn] = useState<any>([]);
  const [tableDataSource, setTableDataSource] = useState<any>([]);
  const [PrimeGeoLevelUID, setPrimeGeoLevelUID] = useState<any>(null);
  const [screenMode, setScreenMode] = useState<string>("manage");
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  // First, add a mounted ref to prevent state updates after unmount
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchSurveyInfo = async () => {
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

    // Start fetching locations early if needed
    let locationPromise;
    if (PrimeGeoLevelUID) {
      locationPromise = dispatch(
        getSurveyLocationsLong({
          survey_uid: survey_uid || "",
          geo_level_uid: PrimeGeoLevelUID,
        })
      );
    }

    // Check for matching locations
    const hasMatchingLocations = selectedRows.some((row: any) => {
      const surveyorLocations = row.surveyor_locations || [];
      return surveyorLocations.some(
        (location: any) => location.geo_level_uid === PrimeGeoLevelUID
      );
    });

    // Pre-filter fields
    const fieldsToExclude = [
      "status",
      "custom_fields",
      "enumerator_uid",
      "monitor_locations",
      "surveyor_locations",
      "monitor_status",
      "surveyor_status",
    ];

    const filteredFields = Object.keys({ ...selectedRows[0] })
      .filter((field) => !fieldsToExclude.includes(field))
      .map((field) => ({
        labelKey: field,
        label: dataTableColumn.find((col: any) => col.dataIndex === field)
          ?.title,
      }));

    // Add location field if needed
    if (hasMatchingLocations) {
      filteredFields.push({
        labelKey: "location",
        label: "Location",
      });
    }

    // Set fields and open modal immediately
    setFieldData(filteredFields);
    setEditData(true);

    // Wait for locations if we started fetching them
    if (locationPromise) {
      try {
        const locationsRequest = await locationPromise;
        dispatch(setLocations(locationsRequest.payload));
      } catch (error) {
        console.error("Error fetching locations:", error);
        message.error("Failed to fetch locations");
      }
    }
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
        console.error("Error fetching sctoForm:", error);
      }
    }
  };

  // Modify the main useEffect to handle loading states better
  useEffect(() => {
    const fetchData = async () => {
      if (!isMounted.current) return;

      try {
        // Don't show loading for these initial checks
        if (!form_uid) {
          await handleFormUID();
          return;
        }

        if (!PrimeGeoLevelUID) {
          await fetchSurveyInfo();
          return;
        }

        // Only show loading when actually fetching enumerator data
        if (screenMode === "manage" && form_uid) {
          setTableLoading(true);
          await getEnumeratorsList(form_uid);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (isMounted.current) {
          message.error("Failed to load data");
          setTableLoading(false);
        }
      }
    };

    fetchData();
  }, [form_uid, screenMode]);

  // Modify getEnumeratorsList to handle PrimeGeoLevelUID internally
  const getEnumeratorsList = async (
    form_uid: string,
    enumerator_type?: string
  ) => {
    if (!isMounted.current) return;

    try {
      const enumeratorRes = await dispatch(
        getEnumerators(
          enumerator_type
            ? { formUID: form_uid, enumeratorType: enumerator_type }
            : { formUID: form_uid }
        )
      );

      if (!isMounted.current) return;

      if (enumeratorRes.payload.status == 200) {
        const originalData = enumeratorRes.payload.data.data;

        // Ensure we have PrimeGeoLevelUID before proceeding
        if (!PrimeGeoLevelUID) {
          await fetchSurveyInfo();
        }

        //move to upload if it is a fresh upload
        if (originalData.length == 0) {
          setTableLoading(false);
          navigate(
            `/survey-information/enumerators/upload/${survey_uid}/${form_uid}`
          );
          message.info("No enumerators found. Kindly upload the enumerators.");
          return;
        }

        message.success("Enumerators loaded successfully.");

        // Initialize counters
        let activeCount = 0;
        let inactiveCount = 0;
        let droppedCount = 0;

        // Iterate through the data
        const dataWithStatus = originalData.map((row: any) => {
          let status = "";

          if (
            row.surveyor_status === "Active" ||
            row.monitor_status === "Active"
          ) {
            status = "Active";
            activeCount++;
          } else if (
            row.surveyor_status === "Inactive" ||
            row.monitor_status === "Inactive"
          ) {
            status = "Inactive";
            inactiveCount++;
          } else if (
            row.surveyor_status === "Dropout" ||
            row.monitor_status === "Dropout"
          ) {
            status = "Dropout";
            droppedCount++;
          }

          return {
            ...row,
            status,
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
              !columnsToExclude.includes(key)
            ) {
              columnMapping[key] = key;
            } else if (key === "surveyor_locations") {
              columnMapping["location"] = "location";
              columnMapping["location_id"] = "location_id";
              columnMapping["location_name"] = "location_name";
            }
          }
          dispatch(setEnumeratorColumnMapping(columnMapping));
        }
        // First check if any enumerator has a matching location
        const hasMatchingLocations = originalData.some((enumerator: any) => {
          const surveyorLocations = enumerator.surveyor_locations || [];
          return surveyorLocations.some(
            (location: any) => location.geo_level_uid === PrimeGeoLevelUID
          );
        });

        // Define column mappings
        let columnMappings = Object.keys(originalData[0])
          .filter((column) => !columnsToExclude.includes(column))
          .filter((column) =>
            originalData.some(
              (row: any) => row[column] !== null && column !== "custom_fields"
            )
          )
          .map((column) => ({
            title: column,
            dataIndex: column,
            width: 90,
            ellipsis: true,
          }));

        // Only add location columns if there are matching locations
        if (hasMatchingLocations) {
          columnMappings.push({
            title: "Location",
            dataIndex: "location",
            width: 90,
            ellipsis: true,
          });
          columnMappings.push({
            title: "Location ID",
            dataIndex: "location_id",
            width: 90,
            ellipsis: true,
          });
          columnMappings.push({
            title: "Location Name",
            dataIndex: "location_name",
            width: 90,
            ellipsis: true,
          });
        }

        // Map the data with locations only if there are matching locations
        const updatedData = originalData.map((enumerator: any) => {
          const surveyorLocations = enumerator.surveyor_locations || [];
          const matchingLocation = surveyorLocations.find(
            (location: any) => location.geo_level_uid === PrimeGeoLevelUID
          );

          return {
            ...enumerator,
            ...(hasMatchingLocations
              ? {
                  location: matchingLocation?.location_name || null,
                  location_id: matchingLocation?.location_id || null,
                  location_name: matchingLocation?.geo_level_name || null,
                }
              : {}),
          };
        });

        const customFieldsSet = new Set(); // Create a set to track unique custom fields
        const customFields = updatedData.reduce((acc: any, row: any) => {
          if (row.custom_fields && typeof row.custom_fields === "object") {
            for (const key in row.custom_fields) {
              if (
                row.custom_fields[key] !== null &&
                !customFieldsSet.has(key) &&
                key !== "column_mapping"
              ) {
                customFieldsSet.add(key); // Add the custom field to the set
                acc.push({
                  title: key,
                  dataIndex: `custom_fields.${key}`,
                  width: 90,
                  ellipsis: true,
                });
              }
            }
          }
          return acc;
        }, []);

        columnMappings = columnMappings.concat(customFields);
        setDataTableColumn(columnMappings);
        const tableDataSource = updatedData.map((item: any, index: any) => {
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
        });

        setTableDataSource(tableDataSource);
      } else {
        message.error(
          "Enumerators failed to load, kindly reload to try again."
        );
      }
    } catch (error) {
      console.error("Error loading enumerators:", error);
      if (isMounted.current) {
        message.error("Failed to load enumerators");
      }
    } finally {
      if (isMounted.current) {
        setTableLoading(false);
      }
    }
  };

  /*
   * New design configs
   */
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
        {screenMode == "manage" ? (
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
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  style={{
                    marginRight: 15,
                    backgroundColor: editMode ? "#2f54eB" : "#d9d9d9",
                    borderColor: editMode ? "#2f54eB" : "#d9d9d9",
                    color: editMode ? "#fff" : "#000",
                  }}
                  onClick={() => onEditDataHandler()}
                  disabled={editMode ? false : true}
                >
                  Edit
                </Button>
                <Button
                  onClick={handlerAddEnumBtn}
                  type="primary"
                  icon={<PlusOutlined />}
                  style={{ marginRight: 15, backgroundColor: "#2f54eB" }}
                >
                  Add enumerators
                </Button>
                <CSVDownloader
                  data={tableDataSource}
                  filename={"enumerators.csv"}
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#2F54EB",
                    color: "#FFF",
                    fontSize: "12px",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    marginRight: 80,
                  }}
                >
                  <DownloadOutlined />
                </CSVDownloader>
              </div>
            </div>
          </>
        ) : null}
      </HeaderContainer>
      {isLoading ? (
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
                  style={{ marginTop: 30 }}
                  scroll={{ x: 1000, y: "calc(100vh - 380px)" }}
                  pagination={{
                    pageSize: paginationPageSize,
                    pageSizeOptions: [10, 25, 50, 100],
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onShowSizeChange: (_, size) => setPaginationPageSize(size),
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
                  />
                ) : null}
              </EnumeratorsHomeFormWrapper>
              <Modal
                title="Add enumerators"
                open={newEnumModal}
                onOk={handleNewEnumMode}
                okText="Continue"
                onCancel={() => setNewEnumModal(false)}
              >
                <Divider />
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
                      <span> I want to start a fresh </span>
                      <span style={{ color: "red" }}>
                        ( Enumerators uploaded previously will be removed.
                        Existing Assignments data will be deleted. )
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
