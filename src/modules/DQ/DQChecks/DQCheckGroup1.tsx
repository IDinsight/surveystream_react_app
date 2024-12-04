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
} from "antd";
import { isEqual } from "lodash";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { ChecksTable, ChecksSwitch, CustomBtn } from "./DQChecks.styled";
import DQChecksFilter from "./DQChecksFilter";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  activateDQChecks,
  deactivateDQChecks,
  deleteDQChecks,
  fetchModuleName,
  getDQChecks,
  postDQChecks,
  putDQChecks,
} from "../../../redux/dqChecks/apiService";
import { getSurveyCTOFormDefinition } from "../../../redux/surveyCTOQuestions/apiService";
import DQCheckDrawer from "../../../components/DQCheckDrawer/DQCheckDrawer";

interface IDQCheckGroup1Props {
  surveyUID: string;
  formUID: string;
  typeID: string;
}

function DQCheckGroup1({ surveyUID, formUID, typeID }: IDQCheckGroup1Props) {
  const navigate = useNavigate();

  const [searchParam] = useSearchParams();
  const modeParam = searchParam.get("mode");

  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<string>("all");

  const [availableModuleNames, setAvailableModuleNames] = useState<string[]>(
    []
  );

  const [availableQuestions, setAvailableQuestions] = useState<any[]>([]);

  // Whole DQ Check data
  const [dqCheckData, setDQCheckData] = useState<any>(null);

  // Individual DQ Check state for mode all
  const [isActive, setIsActive] = useState<boolean>(true);
  const [checkValues, setCheckValues] = useState<string[]>([]);
  const [flagDescription, setFlagDescription] = useState<string>("");
  const [filterData, setFilterData] = useState<any[]>([]);
  const [moduleName, setModuleName] = useState<string>("");

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
      title: "Variable name",
      dataIndex: "questionName",
      key: "questionName",
      sorter: (a: any, b: any) => a.questionName.localeCompare(b.questionName),
    },
    {
      title: "Module name",
      dataIndex: "moduleName",
      key: "moduleName",
      sorter: (a: any, b: any) => a.moduleName.localeCompare(b.moduleName),
    },
    {
      title: "Flag description",
      dataIndex: "flagDescription",
      key: "flagDescription",
    },
    {
      title: (
        <Tooltip title="Click on edit to see the filter applied">
          Filter data
        </Tooltip>
      ),
      dataIndex: "filterData",
      key: "filterData",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value: any) => value.join(", "),
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
      render: (status: any) => (
        <Tag color={status === "Active" ? "green" : "gray"}>{status}</Tag>
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
    value: check.check_components.value,
    status: check.active ? "Active" : "Inactive",
    filters: check.filters,
  }));

  const handleModeChange = (e: RadioChangeEvent) => {
    const newMode = e.target.value;
    navigate(`?mode=${newMode}`);
  };

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

  const handleMarkActive = () => {
    const selectedChecks = selectedVariableRows.map(
      (row: any) => row.dqCheckUID
    );

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
    if (!moduleName) {
      message.error("Please input module name");
      return;
    }

    if (!flagDescription) {
      message.error("Please input flag description");
      return;
    }

    if (checkValues.length === 0) {
      message.error("Please input at least one check value");
      return;
    }

    if (filterData.length > 0) {
      const isFilterValid = filterData.every((filter) => {
        return filter.question_name && filter.filter_operator;
      });

      if (!isFilterValid) {
        message.error("Please input all filter conditions");
        return;
      }
    }

    if (dqCheckData === null) {
      const formData = {
        form_uid: formUID,
        type_id: typeID,
        all_questions: mode === "all" ? true : false,
        module_name: moduleName,
        question_name: null,
        flag_description: flagDescription,
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
          all_questions: mode === "all" ? true : false,
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
      module_name: data.module_name,
      question_name: data.variable_name,
      flag_description: data.flag_description,
      filters: data.filters,
      active: data.is_active,
      check_components: { value: data.check_values },
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

  // Set mode based on URL param
  useEffect(() => {
    if (modeParam && ["all", "selected"].includes(modeParam)) {
      setMode(modeParam);
    }
  }, [modeParam]);

  useEffect(() => {
    if (formUID) {
      fetchModuleName(formUID).then((res: any) => {
        if (res?.data?.success) {
          setAvailableModuleNames(res.data.data);
        }
      });

      if (typeID) {
        setLoading(true);
        getDQChecks(formUID, typeID).then((res: any) => {
          setLoading(false);
          if (res?.data?.success) {
            const checkAllData = res.data.data;

            if (
              checkAllData.length === 1 &&
              checkAllData[0].all_questions === true
            ) {
              // Mode is "all"
              if (mode === "all") {
                setIsActive(checkAllData[0].active);
                setModuleName(checkAllData[0].module_name);
                setFlagDescription(checkAllData[0].flag_description);
                setCheckValues(checkAllData[0].check_components.value);
                setFilterData(checkAllData[0].filters);
                setDQCheckData([checkAllData[0]]);
              } else if (modeParam === "selected") {
                // Clear data for "selected" mode when all_questions is true
                setDQCheckData([]);
              }
            } else {
              // Mode is "selected"
              if (mode === "selected") {
                const selectedData = checkAllData.filter(
                  (check: any) => !check.all_questions
                );
                setDQCheckData(selectedData);
              } else if (modeParam === "all") {
                // Fallback for "all" mode
                setDQCheckData(
                  checkAllData.filter((check: any) => check.all_questions)
                );
              }
            }
          }
        });
      }
    }
  }, [formUID, typeID, mode]);

  // Fetch form definition for questions
  useEffect(() => {
    if (formUID) {
      getSurveyCTOFormDefinition(formUID, false).then((res: any) => {
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

  const isLoading = loading;

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <p style={{ color: "#8C8C8C", fontSize: 14 }}>
            {typeID === "4" &&
              "Checks that certain variables have no missing values. By default, the following are considered missing: ‘ ’, NA, NAN, NULL (caseinsensitive)"}
            {typeID === "5" &&
              "Checks that certain variables have been marked as don’t know. By default, -888 is considered as don’t know."}
            {typeID === "6" &&
              "Checks that certain variables have a high number of refusal values. By default, -999 is considered as refusal."}
          </p>
          <Radio.Group
            value={mode}
            style={{ marginTop: 16, marginBottom: 16 }}
            onChange={handleModeChange}
          >
            <Radio value="all">Apply check on all variables in the form</Radio>
            <Radio value="selected">Apply check on select variables</Radio>
          </Radio.Group>
          {mode === "all" && (
            <>
              <div style={{ marginTop: 16, marginBottom: 16 }}>
                <ChecksSwitch
                  defaultChecked
                  value={isActive}
                  onChange={(val) => setIsActive(val)}
                  checkedChildren="ACTIVE"
                  unCheckedChildren="INACTIVE"
                />
              </div>
              <Row>
                <Col span={4}>
                  <Form.Item
                    label={`Value is ${
                      typeID === "4"
                        ? "missing"
                        : typeID === "5"
                        ? "don't knows"
                        : "refusal"
                    } if value is:`}
                    tooltip="Value that is considered for checks"
                  />
                </Col>
                <Col span={6}>
                  <Select
                    mode="tags"
                    style={{ width: "100%" }}
                    placeholder={
                      typeID === "4"
                        ? "‘’, NA, NAN, NULL"
                        : typeID === "5"
                        ? "-888"
                        : "-999"
                    }
                    value={checkValues}
                    options={checkValues?.map((option: any) => ({
                      value: option,
                      label: option === "''" ? "(empty)" : option,
                    }))}
                    onChange={(newValue) => {
                      const cleanedValues = [...new Set(newValue)];
                      const updatedValues = cleanedValues.map((value) =>
                        value === '""' ? "''" : value
                      );
                      setCheckValues([...new Set(updatedValues)]);
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={4}>
                  <Form.Item
                    label="Flag description:"
                    tooltip="Short description of the flag."
                  />
                </Col>
                <Col span={6}>
                  <Input
                    placeholder="Input flag description"
                    value={flagDescription}
                    onChange={(e) => setFlagDescription(e.target.value)}
                  />
                </Col>
              </Row>
              <div>
                <Form.Item
                  label="Filter data before applying this check:"
                  tooltip="Conditions to filter out the data before applying a check. Example: age < 30"
                />
                <DQChecksFilter
                  filters={filterData}
                  setFilterList={setFilterData}
                  questions={availableQuestions}
                />
              </div>
              <div>
                <Row>
                  <Form.Item label="Group variables in the output data using:" />
                </Row>
                <Row>
                  <Col span={4}>
                    <Form.Item
                      label="Module Name:"
                      style={{ marginLeft: 32 }}
                      tooltip="This column will be included in the outputs and can be used to filter and group the results. If left blank, default value 'DQ' will be used."
                    />
                  </Col>
                  <Col span={6}>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select or input an mode name"
                      showSearch
                      value={moduleName || null}
                      options={availableModuleNames?.map((option: any) => {
                        return { value: option, label: option };
                      })}
                      onChange={(newValue) => setModuleName(newValue)}
                      onBlur={(e: any) => {
                        const inputValue = e.target.value;
                        handleModeNameChange(inputValue);
                      }}
                      onKeyDown={(e: any) => {
                        if (e.key === "Enter") {
                          const inputValue = e.target.value;
                          handleModeNameChange(inputValue);
                        }
                      }}
                    />
                  </Col>
                </Row>
              </div>
              <div>
                <CustomBtn onClick={handleAllSave}>Save</CustomBtn>
                <Button
                  style={{ marginLeft: 32 }}
                  onClick={() =>
                    navigate(
                      `/module-configuration/dq-checks/${surveyUID}/manage?form_uid=${formUID}`
                    )
                  }
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
          {mode === "selected" && (
            <>
              <div style={{ display: "flex" }}>
                <div style={{ marginTop: 16 }}>
                  <Tag
                    color="#F6FFED"
                    style={{ color: "#52C41A", borderColor: "#B7EB8F" }}
                  >
                    {
                      selectVariableData?.filter(
                        (variable: any) => variable.status === "Active"
                      ).length
                    }{" "}
                    active checks
                  </Tag>
                  <Tag
                    color="#FFF7E6"
                    style={{ color: "#FA8C16", borderColor: "#FA8C16" }}
                  >
                    {selectVariableData?.length} checks configured
                  </Tag>
                </div>
                <div style={{ marginLeft: "auto", display: "flex" }}>
                  <Button
                    type="primary"
                    style={{ marginLeft: 16 }}
                    onClick={handleAddCheck}
                  >
                    Add
                  </Button>
                  {selectedVariableRows.length === 1 && (
                    <Button
                      type="primary"
                      style={{ marginLeft: 16 }}
                      onClick={handleEditCheck}
                    >
                      Edit
                    </Button>
                  )}
                  {selectedVariableRows.length > 0 && (
                    <>
                      <Button
                        style={{ marginLeft: 16 }}
                        onClick={handleMarkActive}
                      >
                        Mark active
                      </Button>
                      <Button
                        style={{ marginLeft: 16 }}
                        onClick={handleMarkInactive}
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
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                    </>
                  )}
                </div>
              </div>
              <ChecksTable
                style={{ marginTop: 16 }}
                columns={columns}
                dataSource={selectVariableData}
                pagination={{ pageSize: 5 }}
                rowSelection={rowSelection}
              />
              <DQCheckDrawer
                visible={isAddManualDrawerVisible}
                questions={availableQuestions}
                moduleNames={availableModuleNames}
                data={drawerData}
                variablesValues={variablesValues}
                onSave={handleOnDrawerSave}
                onClose={closeAddManualDrawer}
              />
            </>
          )}
        </>
      )}
    </>
  );
}

export default DQCheckGroup1;
