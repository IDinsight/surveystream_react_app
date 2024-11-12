import { useNavigate, useParams } from "react-router-dom";
import { Button, Divider, Modal, Radio, Space, message } from "antd";

import {
  BackArrow,
  BackLink,
  HeaderContainer,
  NavWrapper,
  Title,
} from "../../../../shared/Nav.styled";
import SideMenu from "../../SideMenu";
import { TargetsHomeFormWrapper, TargetsTable } from "./TargetsHome.styled";
import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import RowEditingModal from "./RowEditingModal";
import TargetsCountBox from "../../../../components/TargetsCountBox";
import {
  setLoading,
  setTargetsColumnMapping,
} from "../../../../redux/targets/targetSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import { getSurveyCTOForm } from "../../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import {
  getTargets,
  getTargetConfig,
} from "../../../../redux/targets/targetActions";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { useCSVDownloader } from "react-papaparse";
import TargetsReupload from "../TargetsReupload";
import TargetsRemap from "../TargetsRemap";
import { includes } from "cypress/types/lodash";
import { GlobalStyle } from "../../../../shared/Global.styled";
import HandleBackButton from "../../../../components/HandleBackButton";
import Container from "../../../../components/Layout/Container";

function TargetsHome() {
  const navigate = useNavigate();

  const { CSVDownloader, Type } = useCSVDownloader();

  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };
  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };

  const dispatch = useAppDispatch();

  const isLoading = useAppSelector((state: RootState) => state.targets.loading);
  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );
  const targetList = useAppSelector(
    (state: RootState) => state.targets.targetsList
  );

  const [targetsCount, setTargetsCount] = useState<number>(0);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editData, setEditData] = useState<boolean>(false);
  const [fieldData, setFieldData] = useState<any>([]);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);
  const [dataTableColumn, setDataTableColumn] = useState<any>([]);
  const [tableDataSource, setTableDataSource] = useState<any>([]);

  // Row selection state and handler
  const [selectedRows, setSelectedRows] = useState<any>([]);

  /*
   * New design configs
   */
  const [screenMode, setScreenMode] = useState<string>("manage");
  const [newTargetModal, setNewTargetModal] = useState<boolean>(false);

  // Mode: overwrite or merge
  const [newTargetMode, setNewTargetMode] = useState<string>("");

  const [isTargetInUse, setIsTargetInUse] = useState<boolean>(false);

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any) => {
    const selectedTargetIds = selectedRows.map((row: any) => row.target_id);

    const selectedTargetData = targetList.filter((row: any) =>
      selectedTargetIds.includes(row.target_id)
    );

    setSelectedRows(selectedTargetData);
  };

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
      await getTargetsList(form_uid);
    }
    setEditData(false);
  };

  const handleFormUID = async () => {
    if (form_uid == "" || form_uid == undefined || form_uid == "undefined") {
      try {
        dispatch(setLoading(true));
        const sctoForm = await dispatch(
          getSurveyCTOForm({ survey_uid: survey_uid })
        );
        if (sctoForm?.payload[0]?.form_uid) {
          navigate(
            `/survey-information/targets/${survey_uid}/${sctoForm?.payload[0]?.form_uid}`
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
  const getTargetsList = async (form_uid: string) => {
    const targetRes = await dispatch(getTargets({ formUID: form_uid }));
    const targetConfig = await dispatch(
      getTargetConfig({ form_uid: form_uid })
    );
    if (targetRes.payload.status == 200) {
      message.success("Targets loaded successfully.");
      //create rowbox data
      const originalData = targetRes.payload.data.data;
      setTargetsCount(originalData.length);
      console.log("targetConfig", targetConfig);

      if (originalData.length == 0) {
        if (targetConfig.payload.success) {
          if (targetConfig.payload.data?.target_source === "csv") {
            navigate(
              `/survey-information/targets/upload/${survey_uid}/${form_uid}`
            );
          } else {
            navigate(
              `/survey-information/targets/config/${survey_uid}/${form_uid}`
            );
          }
        } else {
          navigate(
            `/survey-information/targets/config/${survey_uid}/${form_uid}`
          );
        }
        return;
      }

      const columnsToExclude = [
        "target_uid",
        "target_locations",
        "completed_flag",
        "last_attempt_survey_status",
        "last_attempt_survey_status_label",
        "num_attempts",
        "refusal_flag",
        "revisit_sections",
        "target_assignable",
        "webapp_tag_color",
      ];
      //set targets column mapping

      if (originalData[0]?.custom_fields?.column_mapping) {
        dispatch(
          setTargetsColumnMapping(
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

        dispatch(setTargetsColumnMapping(columnMapping));
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
      message.error("Targets failed to load, kindly reload to try again.");
    }
  };

  const handleNewTargetMode = () => {
    // Emit error if no new targets mode is selected
    if (newTargetMode === "") {
      message.error("Please select the mode to add new targets.");
      return;
    }

    // Redirect to upload fresh targets, in case of fresh upload, otherwise start append mode
    if (newTargetMode === "overwrite") {
      navigate(`/survey-information/targets/upload/${survey_uid}/${form_uid}`);
      return;
    } else if (newTargetMode === "merge") {
      setScreenMode("reupload");
    }

    setNewTargetModal(false);
  };

  const handlerAddTargetBtn = () => {
    if (tableDataSource.length > 0) {
      setNewTargetModal(true);
    } else {
      navigate(`/survey-information/targets/upload/${survey_uid}/${form_uid}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // redirect to upload if missing csvHeaders and cannot perform mapping
      // TODO: update this for configured surveys already
      await handleFormUID();

      if (form_uid && screenMode === "manage") {
        getTargetsList(form_uid);
      }
    };

    fetchData();
  }, [form_uid, screenMode]);

  return (
    <>
      <GlobalStyle />

      <Container surveyPage={true} />
      <HeaderContainer>
        <Title>Targets</Title>

        <div
          style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}
        >
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              color: "#2F54EB",
            }}
          >
            {editMode ? (
              <>
                <Button
                  icon={<EditOutlined />}
                  style={{ marginRight: 15 }}
                  onClick={onEditDataHandler}
                >
                  Edit data
                </Button>
              </>
            ) : null}
            <Button
              type="primary"
              icon={editMode ? null : <EditOutlined />}
              style={{ marginRight: 15, backgroundColor: "#2f54eB" }}
              onClick={() => setEditMode((prev) => !prev)}
            >
              {editMode ? "Done editing" : "Edit"}
            </Button>
            <Button
              onClick={handlerAddTargetBtn}
              type="primary"
              icon={<CloudUploadOutlined />}
              style={{ marginRight: 15, backgroundColor: "#2f54eB" }}
            >
              Upload targets
            </Button>
            <CSVDownloader
              data={tableDataSource}
              filename={"targets.csv"}
              style={{
                cursor: "pointer",
                backgroundColor: "#2F54EB",
                color: "#FFF",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                borderRadius: "5px",
                marginRight: 80,
              }}
            >
              <CloudDownloadOutlined />
            </CSVDownloader>
          </div>
        </div>
      </HeaderContainer>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu />
          {screenMode === "manage" ? (
            <>
              <TargetsHomeFormWrapper>
                <br />
                <TargetsCountBox total={targetsCount} />
                <TargetsTable
                  rowSelection={editMode ? rowSelection : undefined}
                  columns={dataTableColumn}
                  dataSource={tableDataSource}
                  scroll={{ x: 1000, y: "calc(100vh - 380px)" }}
                  style={{ marginRight: 80, marginTop: 30 }}
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
                  />
                ) : null}
              </TargetsHomeFormWrapper>
              <Modal
                title="Add targets"
                open={newTargetModal}
                onOk={handleNewTargetMode}
                okText="Continue"
                onCancel={() => setNewTargetModal(false)}
              >
                <Divider />
                <p>Please select how you want to proceed:</p>
                <Radio.Group
                  style={{ marginBottom: 20 }}
                  onChange={(e) => setNewTargetMode(e.target.value)}
                  value={newTargetMode}
                >
                  <Space direction="vertical">
                    <Radio value="overwrite" disabled={isTargetInUse}>
                      I want to start afresh (targets uploaded previously will
                      be deleted)
                    </Radio>
                    <Radio value="merge">
                      I want to add new targets / columns
                    </Radio>
                  </Space>
                </Radio.Group>
              </Modal>
            </>
          ) : null}
          {screenMode === "reupload" ? (
            <TargetsReupload setScreenMode={setScreenMode} />
          ) : null}
          {screenMode === "remap" ? (
            <TargetsRemap setScreenMode={setScreenMode} />
          ) : null}
        </div>
      )}
    </>
  );
}

export default TargetsHome;
