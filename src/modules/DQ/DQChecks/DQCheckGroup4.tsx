import { useEffect, useState } from "react";
import { Button, Tag, message, Popconfirm, Tooltip, Modal } from "antd";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { ChecksTable } from "./DQChecks.styled";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import {
  activateDQChecks,
  deactivateDQChecks,
  deleteDQChecks,
  getDQChecks,
  postDQChecks,
  putDQChecks,
} from "../../../redux/dqChecks/apiService";
import { getDQConfig } from "../../../redux/dqChecks/dqChecksActions";
import { getSurveyCTOFormDefinition } from "../../../redux/surveyCTOQuestions/apiService";
import DQCheckDrawerGroup4 from "../../../components/DQCheckDrawer/DQCheckDrawerGroup4";
import { ClearOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { CustomBtn, DescriptionText } from "../../../shared/Global.styled";
import DescriptionLink from "../../../components/DescriptionLink";

interface IDQCheckGroup1Props {
  surveyUID: string;
  formUID: string;
  typeID: string;
}

function DQCheckGroup4({ surveyUID, formUID, typeID }: IDQCheckGroup1Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  const [tablePageSize, setTablePageSize] = useState(5);

  const [availableQuestions, setAvailableQuestions] = useState<any[]>([]);

  // Whole DQ Check data
  const [dqCheckData, setDQCheckData] = useState<any>(null);

  const { dqConfig: dqConfig } = useAppSelector(
    (state: RootState) => state.dqChecks
  );

  // Drawer state and functiion
  const [isAddManualDrawerVisible, setIsAddManualDrawerVisible] =
    useState(false);
  const [drawerData, setDrawerData] = useState<any>(null);

  const showAddManualDrawer = () => {
    setIsAddManualDrawerVisible(true);
  };

  const closeAddManualDrawer = () => {
    setIsAddManualDrawerVisible(false);
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "gpsType",
      key: "gpsType",
      render: (gpsType: any) =>
        gpsType === "point2point" ? "Point to Point" : "Point to Shape",
    },
    {
      title: "Variable Name",
      dataIndex: "questionName",
      key: "questionName",
      sorter: (a: any, b: any) => a.questionName.localeCompare(b.questionName),
      filters: dqCheckData?.map((record: any) => ({
        text: record.question_name + (record.is_repeat_group ? "_*" : ""),
        value: record.question_name,
      })),
      onFilter: (value: any, record: any) =>
        record.questionName.indexOf(value) === 0,
      render: (questionName: any, record: any) =>
        questionName + (record.isRepeatGroup ? "_*" : ""),
    },
    {
      title: "Grid ID Variable",
      dataIndex: "gridIDVariable",
      key: "gridIDVariable",
      sorter: (a: any, b: any) => a.questionName.localeCompare(b.questionName),
      render: (gridIDVariable: any, record: any) =>
        gridIDVariable
          ? gridIDVariable + (record.gridIDVariableIsRepeatGroup ? "_*" : "")
          : "",
    },
    {
      title: "Expected GPS Variable",
      dataIndex: "gpsVariable",
      key: "gpsVariable",
      sorter: (a: any, b: any) => a.questionName.localeCompare(b.questionName),
      render: (gpsVariable: any, record: any) =>
        gpsVariable
          ? gpsVariable + (record.gpsVariableIsRepeatGroup ? "_*" : "")
          : "",
    },
    {
      title: "Threshold Distance (m)",
      dataIndex: "threshold",
      key: "threshold",
      sorter: (a: any, b: any) => a.questionName.localeCompare(b.questionName),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
      filters: [
        { text: "Active", value: "Active" },
        { text: "Inactive", value: "Inactive" },
      ],
      onFilter: (value: any, record: any) => record.status.indexOf(value) === 0,
      render: (status: any, record: any) => (
        <>
          <Tag color={status === "Active" ? "green" : "gray"}>{status}</Tag>
          {record.isDeleted && (
            <Tooltip title="This check is inactive because one or more of the variables used in the check are no longer in the form definition.">
              <ExclamationCircleOutlined />
            </Tooltip>
          )}
        </>
      ),
    },
  ];

  const selectVariableData: any = dqCheckData?.map((check: any) => ({
    key: check.dq_check_uid,
    dqCheckUID: check.dq_check_uid,
    questionName: check.question_name,
    gpsType: check.check_components.gps_type,
    threshold: check.check_components.threshold,
    gpsVariable: check.check_components.gps_variable?.question_name,
    gpsVariableIsRepeatGroup:
      check.check_components.gps_variable?.is_repeat_group,
    gridIDVariable: check.check_components.grid_id?.question_name,
    gridIDVariableIsRepeatGroup:
      check.check_components.grid_id?.is_repeat_group,
    status: check.active ? "Active" : "Inactive",
    isDeleted:
      check.note === "Question not found in form definition" ||
      check.note === "Question not found in DQ form definition" ||
      check.note === "Filter question not found in form definition" ||
      check.note === "GPS variable not found in form definition" ||
      check.note === "Grid ID not found in form definition",
    isRepeatGroup: check.is_repeat_group,
  }));

  // Handlers to save, add, edit, mark active, mark inactive, delete checks
  const handleAddCheck = () => {
    showAddManualDrawer();
    setDrawerData(null);
  };

  const handleEditCheck = () => {
    setDrawerData(selectedVariableRows[0]);
    showAddManualDrawer();
  };

  const handleDuplicate = () => {
    const selectedCheck = selectedVariableRows[0];
    const duplicateData = {
      ...selectedCheck,
      questionName: "",
      dqCheckUID: null,
    };

    showAddManualDrawer();
    setDrawerData(duplicateData);
  };

  const handleMarkActiveAction = () => {
    const selectedChecks = selectedVariableRows
      .filter((row: any) => !row.isDeleted)
      .map((row: any) => row.dqCheckUID);

    const formData = {
      form_uid: formUID,
      type_id: typeID,
      check_uids: selectedChecks,
    };

    setLoading(true);
    activateDQChecks(formData).then((res: any) => {
      if (res?.data?.success) {
        message.success("DQ Check activated", 1, () => {
          loadDQChecks();
          setDataLoading(true);
          setSelectedVariableRows([]);
          setLoading(false);
        });
      } else {
        message.error("Failed to activate DQ Checks");
        setLoading(false);
      }
    });
  };

  const handleMarkActive = () => {
    const isDeletedCheck = selectedVariableRows.some(
      (row: any) => row.isDeleted
    );

    if (isDeletedCheck) {
      Modal.confirm({
        title: "Are you sure?",
        content: `Your selection contains some checks which are inactive because one or more of the variables used in the check are no longer in the form definition. This action will mark only the remaining checks as active. Do you want to proceed?`,
        okText: "Yes",
        cancelText: "No",
        width: 600,
        onOk: () => {
          handleMarkActiveAction();
        },
      });
    } else {
      handleMarkActiveAction();
    }
  };

  const handleMarkInactive = () => {
    const selectedChecks = selectedVariableRows.map(
      (row: any) => row.dqCheckUID
    );

    const formData = {
      form_uid: formUID,
      type_id: typeID,
      check_uids: selectedChecks,
    };

    setLoading(true);
    deactivateDQChecks(formData).then((res: any) => {
      if (res?.data?.success) {
        message.success("DQ Check deactivated", 1, () => {
          loadDQChecks();
          setDataLoading(true);
          setSelectedVariableRows([]);
          setLoading(false);
        });
      } else {
        message.error("Failed to deactivate DQ Checks");
        setLoading(false);
      }
    });
  };

  const handleDeleteCheck = () => {
    const selectedChecks = selectedVariableRows.map(
      (row: any) => row.dqCheckUID
    );

    const formData = {
      form_uid: formUID,
      type_id: typeID,
      check_uids: selectedChecks,
    };

    setLoading(true);
    deleteDQChecks(formData).then((res: any) => {
      if (res?.data?.success) {
        message.success("DQ Checks deleted", 1, () => {
          loadDQChecks();
          setDataLoading(true);
          setSelectedVariableRows([]);
          setLoading(false);
        });
      } else {
        message.error("Failed to delete DQ Checks");
        setLoading(false);
      }
    });
  };

  const handleOnDrawerSave = (data: any) => {
    if (!formUID || !typeID) return;

    if (!data) return;

    const checkComponents = {
      gps_type: data.gps_type,
      threshold: data.threshold,
      gps_variable: data.gps_variable,
      grid_id: data.grid_id,
    };

    const formData = {
      form_uid: formUID,
      type_id: typeID,
      all_questions: false,
      module_name: "",
      question_name: data.variable_name,
      flag_description: "",
      filters: [],
      active: data.is_active,
      check_components: checkComponents,
    };

    if (data.dq_check_id) {
      putDQChecks(data.dq_check_id, formData).then((res: any) => {
        setLoading(false);
        if (res?.data?.success) {
          closeAddManualDrawer();
          message.success("DQ Check updated successfully", 1, () => {
            loadDQChecks();
            setDataLoading(true);
            setSelectedVariableRows([]);
            setLoading(false);
          });
        } else {
          message.error("Failed to update DQ Check");
          setLoading(true);
        }
      });
    } else {
      setLoading(true);
      postDQChecks(formUID, typeID, formData).then((res: any) => {
        if (res?.data?.success) {
          closeAddManualDrawer();
          message.success("DQ added successfully", 1, () => {
            loadDQChecks();
            setDataLoading(true);
            setSelectedVariableRows([]);
            setLoading(false);
          });
        } else {
          message.error("Failed to add DQ Check");
          setLoading(false);
        }
      });
    }
  };

  // Row selection
  const [selectedVariableRows, setSelectedVariableRows] = useState<any>([]);
  const rowSelection = {
    selectedVariableRows,
    onSelect: (record: any, selected: any, selectedRow: any) => {
      setSelectedVariableRows(selectedRow);
    },
    onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {
      setSelectedVariableRows(selectedRows);
    },
  };
  // Table sort and filter state
  const [tableSortInfo, setTableSortInfo] = useState<any>(null);
  const [tableFilterInfo, setTableFilterInfo] = useState<any>(null);

  // Clear function to reset table state
  const handleClear = () => {
    setSelectedVariableRows([]);
    setTableSortInfo(null);
    setTableFilterInfo(null);
    loadDQChecks(); // reload original data
  };

  const loadDQChecks = () => {
    if (typeID) {
      setLoading(true);
      getDQChecks(formUID, typeID)
        .then((res: any) => {
          if (res?.data?.success) {
            const checkAllData = res.data.data;

            setDQCheckData(checkAllData);
            setDataLoading(false);
          } else {
            setDQCheckData([]);
            setDataLoading(false);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (formUID) {
      loadDQChecks();
    }
  }, [formUID, typeID]);

  // Fetch form definition for questions
  useEffect(() => {
    if (formUID) {
      getSurveyCTOFormDefinition(formUID, false, true).then((res: any) => {
        if (res?.data?.success) {
          const formDefinition = res.data.data;
          if (formDefinition && formDefinition.questions) {
            // Filter to exclude repeat groups with select_multiple question types
            const filteredQuestions = formDefinition.questions.filter(
              (question: any) =>
                !(
                  question.is_repeat_group &&
                  question.question_type.startsWith("select_multiple")
                )
            );
            const questionNames = filteredQuestions.map((question: any) => ({
              name: question.question_name,
              label:
                question.question_name + (question.is_repeat_group ? "_*" : ""),
              is_multi_select:
                question.question_type.startsWith("select_multiple"),
            }));
            setAvailableQuestions(questionNames);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    if (formUID) {
      dispatch(getDQConfig({ form_uid: formUID }));
    }
  }, [dispatch, formUID]);

  const isLoading = loading;

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <DescriptionText>
            This check verifies if GPS location of the household is within the
            expected grid cell or shape boundary/the household surveyed is the
            correct sampled household.{" "}
            <DescriptionLink
              link={
                "https://docs.surveystream.idinsight.io/hfc_configuration#gps"
              }
            />
          </DescriptionText>

          <>
            <div style={{ display: "flex", marginTop: 24 }}>
              <div>
                <Tag
                  color="#F6FFED"
                  style={{ color: "#52C41A", borderColor: "#B7EB8F" }}
                >
                  {selectVariableData?.filter(
                    (variable: any) => variable.status === "Active"
                  ).length || 0}{" "}
                  active checks
                </Tag>
                <Tag
                  color="#FFF7E6"
                  style={{ color: "#FA8C16", borderColor: "#FA8C16" }}
                >
                  {selectVariableData?.length || 0} checks configured
                </Tag>
              </div>
              <div style={{ marginLeft: "auto", display: "flex" }}>
                <CustomBtn style={{ marginLeft: 16 }} onClick={handleAddCheck}>
                  Add
                </CustomBtn>

                <CustomBtn
                  style={{ marginLeft: 16 }}
                  onClick={handleEditCheck}
                  disabled={selectedVariableRows.length !== 1}
                >
                  Edit
                </CustomBtn>
                <CustomBtn
                  style={{ marginLeft: 16 }}
                  onClick={handleDuplicate}
                  disabled={selectedVariableRows.length !== 1}
                >
                  Duplicate
                </CustomBtn>

                <>
                  <CustomBtn
                    style={{ marginLeft: 16 }}
                    onClick={handleMarkActive}
                    disabled={
                      selectedVariableRows.length === 0 ||
                      !selectedVariableRows.some(
                        (row: any) => row.status === "Inactive"
                      )
                    }
                  >
                    Mark active
                  </CustomBtn>
                  <CustomBtn
                    style={{ marginLeft: 16 }}
                    onClick={handleMarkInactive}
                    disabled={
                      selectedVariableRows.length === 0 ||
                      !selectedVariableRows.some(
                        (row: any) => row.status === "Active"
                      )
                    }
                  >
                    Mark inactive
                  </CustomBtn>
                  <Popconfirm
                    title="Are you sure you want to delete checks?"
                    onConfirm={(e: any) => {
                      e?.stopPropagation();
                      handleDeleteCheck();
                    }}
                    onCancel={(e: any) => e?.stopPropagation()}
                    okText="Yes"
                    cancelText="No"
                  >
                    <CustomBtn
                      style={{ marginLeft: 16 }}
                      onClick={(e) => e.stopPropagation()}
                      disabled={selectedVariableRows.length === 0}
                    >
                      Delete
                    </CustomBtn>
                  </Popconfirm>
                  <Button
                    style={{
                      cursor: "pointer",
                      marginLeft: 15,
                      padding: "8px 16px",
                      borderRadius: "5px",
                      fontSize: "14px",
                    }}
                    onClick={handleClear}
                    disabled={!(tableSortInfo || tableFilterInfo)}
                    icon={<ClearOutlined />}
                  />
                </>
              </div>
            </div>
            <ChecksTable
              style={{ marginTop: 16 }}
              columns={columns}
              bordered={true}
              dataSource={selectVariableData}
              pagination={{
                pageSize: tablePageSize,
                pageSizeOptions: ["5", "10", "20", "50", "100"],
                showSizeChanger: true,
                onShowSizeChange: (current, size) => setTablePageSize(size),
              }}
              rowSelection={rowSelection}
              loading={dataLoading}
              rowClassName={(record: any) =>
                record.isDeleted ? "greyed-out-row" : ""
              }
              onChange={(pagination, filters, sorter) => {
                setTableSortInfo(sorter);
                setTableFilterInfo(filters);
              }}
            />
            <DQCheckDrawerGroup4
              visible={isAddManualDrawerVisible}
              questions={availableQuestions}
              typeID={typeID}
              data={drawerData}
              onSave={handleOnDrawerSave}
              onClose={closeAddManualDrawer}
            />
          </>
        </>
      )}
    </>
  );
}

export default DQCheckGroup4;
