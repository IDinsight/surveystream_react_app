import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Tag,
  RadioChangeEvent,
  Select,
  message,
  Popconfirm,
  Tooltip,
  Modal,
} from "antd";
import { isEqual, set } from "lodash";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { ChecksTable } from "./DQChecks.styled";
import DQChecksFilter from "./DQChecksFilter";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import DQCheckDrawerGroup3 from "../../../components/DQCheckDrawer/DQCheckDrawerGroup3";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { getDQForms } from "../../../redux/dqForm/dqFormActions";
import { CustomBtn } from "../../../shared/Global.styled";

interface IDQCheckGroup3Props {
  surveyUID: string;
  formUID: string;
  typeID: string;
}

function DQCheckGroup3({ surveyUID, formUID, typeID }: IDQCheckGroup3Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [searchParam] = useSearchParams();

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

  // Individual DQ Check state for mode all
  const [isActive, setIsActive] = useState<boolean>(true);
  const [checkValues, setCheckValues] = useState<string[]>([]);
  const [flagDescription, setFlagDescription] = useState<string>("");
  const [filterData, setFilterData] = useState<any[]>([]);
  const [moduleName, setModuleName] = useState<string>("");

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

  const showAddManualDrawer = () => {
    setIsAddManualDrawerVisible(true);
  };

  const closeAddManualDrawer = () => {
    setIsAddManualDrawerVisible(false);
  };

  // Table columns for mode selected
  const columns = [
    {
      title: "DQ form ID",
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
      title: "Variable name",
      dataIndex: "questionName",
      key: "questionName",
      sorter: (a: any, b: any) => a.questionName.localeCompare(b.questionName),
      render: (questionName: any, record: any) =>
        questionName + (record.isRepeatGroup ? "_*" : ""),
    },
    ...(typeID === "9"
      ? [
          {
            title: "Score name",
            dataIndex: "spotcheck_score_name",
            key: "spotcheck_score_name",
            sorter: (a: any, b: any) =>
              a.spotcheck_score_name.localeCompare(b.spotcheck_score_name),
          },
        ]
      : []),
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
    isDeleted: check.note === "Question not found in form definition",
    isRepeatGroup: check.is_repeat_group,
  }));

  const handleModeNameChange = (val: string) => {
    if (val && !availableModuleNames.includes(val)) {
      setAvailableModuleNames((prevOptions) => [...prevOptions, val]);
      setModuleName(val);
    }
  };

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
      setLoading(false);
      if (res?.data?.success) {
        message.success("DQ Check activated", 1, () => {
          navigate(0);
        });
      } else {
        message.error("Failed to activate DQ Checks");
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
        content: `Your selection contains some checks that have been deleted from the form definition. This action will mark only the active checks as active. Do you want to proceed?`,
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
      setLoading(false);
      if (res?.data?.success) {
        message.success("DQ Check deactivated", 1, () => {
          navigate(0);
        });
      } else {
        message.error("Failed to deactivate DQ Checks");
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
      setLoading(false);
      if (res?.data?.success) {
        message.success("DQ Checks deleted", 1, () => {
          navigate(0);
        });
      } else {
        message.error("Failed to delete DQ Checks");
      }
    });
  };

  const handleAllSave = () => {
    if (!formUID || !typeID) return;

    // Validate data
    if (checkValues.length === 0) {
      message.error("Please input at least one check value");
      return;
    }

    if (filterData.length > 0) {
      const isFilterValid = filterData.every((filter) => {
        return filter.filter_group.every(
          (group: any) => group.question_name && group.filter_operator
        );
      });

      if (!isFilterValid) {
        message.error("Please input all filter conditions");
        return;
      }
    }

    if (dqCheckData === null || dqCheckData.length === 0) {
      const formData = {
        form_uid: formUID,
        type_id: typeID,
        module_name: moduleName || "",
        question_name: null,
        flag_description: flagDescription || "",
        filters: filterData,
        active: isActive,
        check_components: { value: checkValues },
      };

      setLoading(true);
      postDQChecks(formUID, typeID, formData).then((res: any) => {
        setLoading(false);
        if (res?.data?.success) {
          message.success("DQ Check saved successfully", 1, () => {
            navigate(0);
          });
        } else {
          message.error("Failed to save DQ Check");
        }
      });
    } else {
      if (
        dqCheckData.length > 0 &&
        dqCheckData[0].all_questions === true &&
        dqCheckData[0].dq_check_uid
      ) {
        // Update existing DQ Check
        const formData = {
          form_uid: formUID,
          type_id: typeID,
          module_name: moduleName,
          question_name: null,
          flag_description: flagDescription,
          filters: filterData,
          active: isActive,
          check_components: { value: checkValues },
        };

        setLoading(true);
        putDQChecks(dqCheckData[0].dq_check_uid, formData).then((res: any) => {
          setLoading(false);
          if (res?.data?.success) {
            message.success("DQ Check updated successfully", 1, () => {
              navigate(0);
            });
          }
        });
      } else {
        message.error("DQ Check not found to update it.");
        return;
      }
    }
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
        setLoading(false);
        if (res?.data?.success) {
          closeAddManualDrawer();
          message.success("DQ Check updated successfully", 1, () => {
            navigate(0);
          });
        } else {
          message.error("Failed to update DQ Check");
        }
      });
    } else {
      setLoading(true);
      postDQChecks(formUID, typeID, formData).then((res: any) => {
        setLoading(false);
        if (res?.data?.success) {
          closeAddManualDrawer();
          message.success("DQ added successfully", 1, () => {
            navigate(0);
          });
        } else {
          message.error("Failed to add DQ Check");
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

  useEffect(() => {
    if (formUID) {
      fetchModuleName(formUID).then((res: any) => {
        if (res?.data?.success) {
          setAvailableModuleNames(
            res.data.data.filter((name: string) => name !== "" && name)
          );
        }
      });

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
    }
  }, [formUID, typeID]);

  // Fetch form definition for questions
  useEffect(() => {
    if (formUID) {
      getSurveyCTOFormDefinition(formUID, false, true).then((res: any) => {
        if (res?.data?.success) {
          const formDefinition = res.data.data;
          if (formDefinition && formDefinition.questions) {
            const questionNames = formDefinition.questions.map(
              (question: any) => ({
                name: question.question_name,
                label:
                  question.question_name +
                  (question.is_repeat_group ? "_*" : ""),
              })
            );
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
        (dqForm: any) => dqForm.parent_form_uid === formUID
      );
      setSelectedDqForms(dqForms);
    } else {
      setSelectedDqForms([]);
    }
  }, [dqForms, formUID]);

  const isLoading = loading;

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <p style={{ color: "#8C8C8C", fontSize: 14 }}>
            {typeID === "7" &&
              "Checks that a variable value in the main form matches the value of the same variable recorded in a data quality form (backcheck/ audioaudit/ spotcheck form). Kindly note that the variable name in the two forms have to be the same."}
            {typeID === "8" &&
              "Checks if a protocol has been violated. For all protocol questions, calculations assume that the value 1 indicates a violation, while the value 0 indicates no violation."}
            {typeID === "9" &&
              "Averages the spotcheck scores recorded in data quality forms. Multiple spotcheck question responses can be aggregated to one score using the 'Score name' input."}
          </p>
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
                  disabled={selectedVariableRows.length === 0}
                >
                  Mark active
                </CustomBtn>
                <Button
                  style={{ marginLeft: 16 }}
                  onClick={handleMarkInactive}
                  disabled={selectedVariableRows.length === 0}
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
                    type="primary"
                    style={{ marginLeft: 16 }}
                    onClick={(e) => e.stopPropagation()}
                    disabled={selectedVariableRows.length === 0}
                  >
                    Delete
                  </Button>
                </Popconfirm>
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
            <DQCheckDrawerGroup3
              visible={isAddManualDrawerVisible}
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
