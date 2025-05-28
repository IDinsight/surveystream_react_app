import { useEffect, useState } from "react";
import { Button, Tag, message, Popconfirm, Tooltip, Modal } from "antd";
import { isEqual } from "lodash";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { ChecksTable } from "./DQChecks.styled";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import {
  activateDQChecks,
  deactivateDQChecks,
  deleteDQChecks,
  fetchModuleName,
  getDQChecks,
  postDQChecks,
  putDQChecks,
} from "../../../redux/dqChecks/apiService";
import { getDQConfig } from "../../../redux/dqChecks/dqChecksActions";
import { getSurveyCTOFormDefinition } from "../../../redux/surveyCTOQuestions/apiService";
import DQCheckDrawerGroup2 from "../../../components/DQCheckDrawer/DQCheckDrawerGroup2";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { CustomBtn } from "../../../shared/Global.styled";

interface IDQCheckGroup1Props {
  surveyUID: string;
  formUID: string;
  typeID: string;
}

function DQCheckGroup2({ surveyUID, formUID, typeID }: IDQCheckGroup1Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  const [tablePageSize, setTablePageSize] = useState(5);

  const [availableModuleNames, setAvailableModuleNames] = useState<string[]>(
    []
  );
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
  const [variablesValues, setVariablesValues] = useState<string[]>([]);

  const showAddManualDrawer = () => {
    setIsAddManualDrawerVisible(true);
  };

  const closeAddManualDrawer = () => {
    setIsAddManualDrawerVisible(false);
  };

  const columns = [
    {
      title: "Variable name",
      dataIndex: "questionName",
      key: "questionName",
      sorter: (a: any, b: any) => a.questionName.localeCompare(b.questionName),
      render: (questionName: any, record: any) =>
        questionName + (record.isRepeatGroup ? "_*" : ""),
    },
    ...(dqConfig?.group_by_module_name
      ? [
          {
            title: "Module name",
            dataIndex: "moduleName",
            key: "moduleName",
            sorter: (a: any, b: any) =>
              (a.moduleName || "").localeCompare(b.moduleName || ""),
          },
        ]
      : []),
    {
      title: "Flag description",
      dataIndex: "flagDescription",
      key: "flagDescription",
    },
    {
      title: (
        <Tooltip title="Click on edit to view the filter conditions">
          Filter applied
        </Tooltip>
      ),
      dataIndex: "filterData",
      key: "filterData",
    },
    ...(typeID === "2"
      ? [
          {
            title: "Constraints",
            dataIndex: "constraintsData",
            render: (val: any, record: any) => {
              return [
                record.hardMin ?? "-",
                record.softMin ?? "-",
                record.softMax ?? "-",
                record.hardMax ?? "-",
              ].join(", ");
            },
          },
        ]
      : []),
    ...(typeID === "3"
      ? [
          {
            title: "Value",
            dataIndex: "outlinerValues",
            render: (val: any, record: any) => {
              if (record.outlinerMetric === "interquartile_range") {
                return `${record.outlinerValue} x IQR`;
              }
              if (record.outlinerMetric === "standard_deviation") {
                return `${record.outlinerValue} x SD`;
              }

              if (record.outlinerMetric === "percentile") {
                return <>&plusmn; {record.outlinerValue}th Percentile</>;
              }
            },
          },
        ]
      : []),
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
    allQuestions: check.all_questions,
    questionName: check.question_name,
    moduleName: check.module_name,
    flagDescription: check.flag_description,
    filterData: check.filters.length > 0 ? "Yes" : "-",
    outlinerMetric: check.check_components.outlier_metric,
    outlinerValue: check.check_components.outlier_value,
    hardMin: check.check_components.hard_min,
    hardMax: check.check_components.hard_max,
    softMin: check.check_components.soft_min,
    softMax: check.check_components.soft_max,
    status: check.active ? "Active" : "Inactive",
    filters: check.filters,
    isDeleted:
      check.note === "Question not found in form definition" ||
      check.note === "Question not found in DQ form definition" ||
      check.note === "Filter question not found in form definition",
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

    let checkComponents = null;
    if (typeID === "3") {
      checkComponents = {
        outlier_metric: data.outliner_metric,
        outlier_value: data.outliner_value,
      };
    } else if (typeID === "2") {
      checkComponents = {
        hard_min: data.hard_min,
        hard_max: data.hard_max,
        soft_min: data.soft_min,
        soft_max: data.soft_max,
      };
    }

    const formData = {
      form_uid: formUID,
      type_id: typeID,
      all_questions: false,
      module_name: data.module_name || "",
      question_name: data.variable_name,
      flag_description: data.flag_description || "",
      filters: data.filters,
      active: data.is_active,
      check_components: checkComponents,
    };

    if (data.dq_check_id) {
      setLoading(true);
      putDQChecks(data.dq_check_id, formData).then((res: any) => {
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
          setLoading(false);
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

  // Fetch DQ checks
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
    } else {
      message.error("Failed to fetch DQ Checks");
    }
  };

  useEffect(() => {
    if (formUID) {
      fetchModuleName(formUID).then((res: any) => {
        if (res?.data?.success) {
          setAvailableModuleNames(
            res.data.data.filter((name: string) => name !== "" && name)
          );
        }
      });

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
    if (selectVariableData && selectVariableData.length > 0) {
      const variablesVals: string[] = [];
      selectVariableData.map((variable: any) => {
        if (variable?.value && Array.isArray(variable.value)) {
          variablesVals.push(...variable.value);
        }
      });
      if (!isEqual(variablesVals, variablesValues)) {
        setVariablesValues(variablesVals);
      }
    }
  }, [selectVariableData]);

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
          <p style={{ color: "#8C8C8C", fontSize: 14 }}>
            {typeID === "2" &&
              "This check verifies that continuous variables fall within soft and hard constraints. A soft constraint is a range that most values should fall within, but it is not logically impossible to encounter values outside this range (e.g. # of children 0 - 10). A hard constraint is a range that all values should fall within and anything outside is highly dubious (e.g. age 0 - 130)."}
            {typeID === "3" &&
              "This check verifies whether certain continuous variables contain outliers, where an outlier is defined to be a certain multiple of the IQR or SD or as values beyond a given percentile"}
          </p>

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
                  <Button
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
                  </Button>
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
                    <Button
                      style={{ marginLeft: 16 }}
                      onClick={(e) => e.stopPropagation()}
                      disabled={selectedVariableRows.length === 0}
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                </>
              </div>
            </div>
            <ChecksTable
              style={{ marginTop: 16 }}
              columns={columns}
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
            />
            <DQCheckDrawerGroup2
              visible={isAddManualDrawerVisible}
              questions={availableQuestions}
              typeID={typeID}
              showModuleName={dqConfig?.group_by_module_name}
              moduleNames={availableModuleNames}
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

export default DQCheckGroup2;
