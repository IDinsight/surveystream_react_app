import { useEffect, useState } from "react";
import { Button, Tag, message, Popconfirm, Tooltip, Modal } from "antd";
import { isEqual, set } from "lodash";
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
  postDQChecksBulk,
  putDQChecks,
} from "../../../redux/dqChecks/apiService";
import { getDQConfig } from "../../../redux/dqChecks/dqChecksActions";
import { getSurveyCTOFormDefinition } from "../../../redux/surveyCTOQuestions/apiService";
import DQCheckDrawerGroup3 from "../../../components/DQCheckDrawer/DQCheckDrawerGroup3";
import { getDQForms } from "../../../redux/dqForm/dqFormActions";
import { ClearOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { CustomBtn, DescriptionText } from "../../../shared/Global.styled";
import DescriptionLink from "../../../components/DescriptionLink";
interface IDQCheckGroup3Props {
  surveyUID: string;
  formUID: string;
  typeID: string;
}

function DQCheckGroup3({ surveyUID, formUID, typeID }: IDQCheckGroup3Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  const [tablePageSize, setTablePageSize] = useState(5);

  const [availableModuleNames, setAvailableModuleNames] = useState<string[]>(
    []
  );
  const [availableScoreNames, setAvailableScoreNames] = useState<string[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<any[]>([]);

  // Whole DQ Check data
  const [dqCheckData, setDQCheckData] = useState<any>(null);

  const { loading: isDQFormLoading, dqForms } = useAppSelector(
    (state: RootState) => state.dqForms
  );
  const [selectedDqForms, setSelectedDqForms] = useState<any[]>([]);

  const { dqConfig: dqConfig } = useAppSelector(
    (state: RootState) => state.dqChecks
  );

  // Drawer state and functiion
  const [isAddManualDrawerVisible, setIsAddManualDrawerVisible] =
    useState(false);
  const [drawerData, setDrawerData] = useState<any>(null);
  const [variablesValues, setVariablesValues] = useState<string[]>([]);
  const [drawerMode, setDrawerMode] = useState<string>("single");

  const showAddManualDrawer = () => {
    setIsAddManualDrawerVisible(true);
  };

  const closeAddManualDrawer = () => {
    setIsAddManualDrawerVisible(false);
  };

  // Table columns for mode selected
  const columns = [
    {
      title: "DQ Form ID",
      dataIndex: "dq_scto_form_uid",
      key: "dq_scto_form_uid",
      width: 150,
      sorter: (a: any, b: any) => a.dq_scto_form_uid - b.dq_scto_form_uid,
      render: (dq_scto_form_uid: any) =>
        dqForms.find((form: any) => form.form_uid === dq_scto_form_uid)
          ?.scto_form_id,
      filters: dqForms.map((form: any) => ({
        text: form.scto_form_id,
        value: form.form_uid,
      })),
      onFilter: (value: any, record: any) => record.dq_scto_form_uid === value,
    },
    {
      title: "Variable Name",
      dataIndex: "questionName",
      key: "questionName",
      sorter: (a: any, b: any) => a.questionName.localeCompare(b.questionName),
      render: (questionName: any, record: any) =>
        questionName + (record.isRepeatGroup ? "_*" : ""),
      filters: dqCheckData?.map((record: any) => ({
        text: record.question_name + (record.is_repeat_group ? "_*" : ""),
        value: record.question_name,
      })),
      onFilter: (value: any, record: any) =>
        record.questionName.indexOf(value) === 0,
    },
    ...(typeID === "9"
      ? [
          {
            title: "Score Name",
            dataIndex: "spotcheck_score_name",
            key: "spotcheck_score_name",
            sorter: (a: any, b: any) =>
              a.spotcheck_score_name.localeCompare(b.spotcheck_score_name),
            filters: availableScoreNames.map((name: string) => ({
              text: name,
              value: name,
            })),
            onFilter: (value: any, record: any) =>
              (record.spotcheck_score_name || "").indexOf(value) === 0,
          },
        ]
      : []),
    ...(dqConfig?.group_by_module_name
      ? [
          {
            title: "Module Name",
            dataIndex: "moduleName",
            key: "moduleName",
            sorter: (a: any, b: any) =>
              (a.moduleName || "").localeCompare(b.moduleName || ""),
            filters: availableModuleNames.map((name: string) => ({
              text: name,
              value: name,
            })),
            onFilter: (value: any, record: any) =>
              (record.moduleName || "").indexOf(value) === 0,
          },
        ]
      : []),
    {
      title: "Flag Description",
      dataIndex: "flagDescription",
      key: "flagDescription",
    },
    {
      title: (
        <Tooltip title="Click on edit to view the filter conditions">
          Filter Applied
        </Tooltip>
      ),
      dataIndex: "filterData",
      key: "filterData",
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
    allQuestions: check.all_questions,
    questionName: check.question_name,
    moduleName: check.module_name,
    flagDescription: check.flag_description,
    filterData: check.filters.length > 0 ? "Yes" : "-",
    dq_scto_form_uid: check.dq_scto_form_uid,
    spotcheck_score_name: check.check_components.spotcheck_score_name,
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
    setDrawerMode("single");
    showAddManualDrawer();
    setDrawerData(null);
  };

  // Handlers to bulk add checks
  const handleBulkAddCheck = () => {
    setDrawerMode("bulk");
    showAddManualDrawer();
    setDrawerData(null);
  };

  const handleEditCheck = () => {
    setDrawerMode("single");
    setDrawerData(selectedVariableRows[0]);
    showAddManualDrawer();
    setDrawerData(null);
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

    const formData = {
      form_uid: formUID,
      type_id: typeID,
      all_questions: false,
      module_name: data.module_name || "",
      question_name: data.variable_name,
      flag_description: data.flag_description || "",
      filters: data.filters,
      active: data.is_active,
      check_components: {
        spotcheck_score_name:
          typeID === "9" ? data.spotcheck_score_name : undefined,
      },
      dq_scto_form_uid: data.dq_scto_form_uid,
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
      if (
        data.variable_name &&
        Array.isArray(data.variable_name) &&
        data.variable_name.length > 1
      ) {
        postDQChecksBulk(formUID, typeID, formData).then((res: any) => {
          if (res?.data?.success) {
            closeAddManualDrawer();
            message.success("DQ checks added successfully", 1, () => {
              loadDQChecks();
              setDataLoading(true);
              setSelectedVariableRows([]);
              setLoading(false);
            });
          } else {
            message.error("Failed to add DQ Checks");
            setLoading(false);
          }
        });
      } else {
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

            if (typeID === "9") {
              const scoreNames = checkAllData.map(
                (check: any) => check.check_components.spotcheck_score_name
              );
              setAvailableScoreNames(scoreNames);
            } else {
              setAvailableScoreNames([]);
            }

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

  useEffect(() => {
    if (surveyUID) {
      dispatch(getDQForms({ survey_uid: surveyUID }));
    }
  }, [dispatch, surveyUID]);

  useEffect(() => {
    if (dqForms.length > 0 && formUID) {
      const selectedDqForms = dqForms.filter(
        (form: any) => form.parent_form_uid?.toString() === formUID
      );
      setSelectedDqForms(selectedDqForms);
    } else {
      setSelectedDqForms([]);
    }
  }, [dqForms, formUID]);

  const isLoading = loading || isDQFormLoading;

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <DescriptionText>
            {typeID === "7" && (
              <>
                Checks that a variable value in the main form matches the value
                of the same variable recorded in a data quality form (backcheck/
                audioaudit/ spotcheck form). Kindly note that the variable name
                in the two forms have to be the same.{" "}
                <DescriptionLink
                  link={
                    "https://docs.surveystream.idinsight.io/hfc_configuration#mismatch"
                  }
                />
              </>
            )}
            {typeID === "8" && (
              <>
                Checks if a protocol has been violated. For all protocol
                questions, calculations assume that the value 0 indicates a
                violation, while the value 1 indicates no violation.{" "}
                <DescriptionLink
                  link={
                    "https://docs.surveystream.idinsight.io/hfc_configuration#protocol-violation"
                  }
                />
              </>
            )}
            {typeID === "9" && (
              <>
                Averages the spotcheck scores recorded in data quality forms.
                Multiple variables can be aggregated to one score using the
                Score name input.{" "}
                <DescriptionLink
                  link={
                    "https://docs.surveystream.idinsight.io/hfc_configuration#spotcheck-score"
                  }
                />
              </>
            )}
          </DescriptionText>
          <>
            <div style={{ display: "flex", marginTop: 24 }}>
              <div style={{ marginTop: 16 }}>
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
                {typeID !== "9" && (
                  <CustomBtn
                    style={{ marginLeft: 16 }}
                    onClick={handleBulkAddCheck}
                  >
                    Bulk Add
                  </CustomBtn>
                )}
                <CustomBtn
                  type="primary"
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
            <DQCheckDrawerGroup3
              visible={isAddManualDrawerVisible}
              drawerMode={drawerMode}
              parentFormQuestions={availableQuestions}
              typeID={typeID}
              dqForms={selectedDqForms}
              showModuleName={dqConfig?.group_by_module_name}
              moduleNames={availableModuleNames}
              scoreNames={availableScoreNames}
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

export default DQCheckGroup3;
