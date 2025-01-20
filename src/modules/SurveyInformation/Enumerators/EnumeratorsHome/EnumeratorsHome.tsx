import { useEffect, useState } from "react";
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
} from "../../../../redux/enumerators/enumeratorsSlice";
import { getSurveyCTOForm } from "../../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { getEnumerators } from "../../../../redux/enumerators/enumeratorsActions";

import EnumeratorsReupload from "./../EnumeratorsReupload";
import EnumeratorsRemap from "../EnumeratorsRemap";
import { GlobalStyle } from "../../../../shared/Global.styled";
import Container from "../../../../components/Layout/Container";

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

  const [activeEnums, setActiveEnums] = useState<number>(0);
  const [droppedEnums, setDroppedEnums] = useState<number>(0);
  const [inactiveEnums, setInactiveEnums] = useState<number>(0);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editData, setEditData] = useState<boolean>(false);
  const [fieldData, setFieldData] = useState<any>([]);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);
  const [dataTableColumn, setDataTableColumn] = useState<any>([]);
  const [tableDataSource, setTableDataSource] = useState<any>([]);

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
  };
  useEffect(() => {
    if (selectedRows.length > 0) {
      setEditMode(true);
    }
  }, [selectedRows]);

  const rowSelection = {
    selectedRows,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRows.length > 0;

  // Handler for Edit Data button
  const onEditDataHandler = () => {
    if (!hasSelected) {
      message.error("No row selected for editing");
      return;
    }
    setEditData(true);

    // Setting the fields to show on Modal
    const fields = Object.keys({ ...selectedRows[0] })
      .filter((field) => field !== "key")
      .map((field: any) => {
        if (field === "custom_fields") {
          if (
            selectedRows[0][field] &&
            typeof selectedRows[0][field] === "object"
          ) {
            const customFields = selectedRows[0][field];

            return Object.keys(customFields)
              .filter((key) => key !== "column_mapping") // Filter out "column_mapping"
              .map((key) => ({
                labelKey: key,
                label: `custom_fields.${key}`,
              }));
          }
        }
        return {
          labelKey: field,
          label: dataTableColumn.find((col: any) => col.dataIndex === field)
            ?.title,
        };
      })
      .flat();

    setFieldData(fields);
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
    const enumeratorRes = await dispatch(
      getEnumerators(
        enumerator_type
          ? { formUID: form_uid, enumeratorType: enumerator_type }
          : { formUID: form_uid }
      )
    );

    if (enumeratorRes.payload.status == 200) {
      //create rowbox data
      const originalData = enumeratorRes.payload.data.data;

      if (originalData.length == 0) {
        //move to upload if it is a fresh upload
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
          }
        }

        dispatch(setEnumeratorColumnMapping(columnMapping));
      }

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
        })); // Filter out columns with all null values

      const customFieldsSet = new Set(); // Create a set to track unique custom fields
      const customFields = originalData.reduce((acc: any, row: any) => {
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

      const tableDataSource = originalData.map((item: any, index: any) => {
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
      message.error("Enumerators failed to load, kindly reload to try again.");
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

  useEffect(() => {
    const fetchData = async () => {
      // redirect to upload if missing csvHeaders and cannot perform mapping
      // TODO: update this for configured surveys already
      await handleFormUID();

      if (form_uid && screenMode === "manage") {
        await getEnumeratorsList(form_uid);
      }
    };

    fetchData();
  }, [form_uid, screenMode]);

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
