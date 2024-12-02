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
} from "antd";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { ChecksTable, ChecksSwitch, CustomBtn } from "./DQChecks.styled";
import DQChecksFilter from "./DQChecksFilter";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchModuleName,
  getDQChecks,
  postDQChecks,
  putDQChecks,
} from "../../../redux/dqChecks/apiService";
import { getSurveyCTOFormDefinition } from "../../../redux/surveyCTOQuestions/apiService";
import DQCheckDrawer from "../../../components/DQCheckDrawer/DQCheckDrawer";
import { filter } from "lodash";

interface IDQCheckGroup1Props {
  surveyUID: string;
  formUID: string;
  typeID: string;
}

function DQCheckGroup1({ formUID, typeID }: IDQCheckGroup1Props) {
  const navigate = useNavigate();

  const [searchParam] = useSearchParams();
  const modeParam = searchParam.get("mode");

  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<string>("all");

  const [moduleName, setModuleName] = useState<string>("");
  const [availableModuleNames, setAvailableModuleNames] = useState<string[]>(
    []
  );

  const [availableQuestions, setAvailableQuestions] = useState<any[]>([]);

  // DQ Check data
  const [dqCheckData, setDQCheckData] = useState<any>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [checkValues, setCheckValues] = useState<string[]>([]);
  const [flagDescription, setFlagDescription] = useState<string>("");
  const [filterData, setFilterData] = useState<any[]>([]);

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
      title: "Variable name",
      dataIndex: "questionName",
      key: "questionName",
      sorter: true,
    },
    {
      title: "Module name",
      dataIndex: "moduleName",
      key: "moduleName",
      sorter: true,
    },
    {
      title: "Flag description",
      dataIndex: "flagDescription",
      key: "flagDescription",
    },
    {
      title: "Constraint",
      dataIndex: "constraint",
      key: "constraint",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
    constraint: check.filters.length,
    value: check.check_components.value,
    status: check.active ? "Active" : "Inactive",
    filters: check.filters,
  }));

  const handleModeChange = (e: RadioChangeEvent) => {
    const newMode = e.target.value;

    if (newMode === "selected") {
      // Clear table data when switching to "selected" mode
      const filteredData =
        dqCheckData?.filter((check: any) => !check.all_questions) || [];
      setDQCheckData(filteredData);
    } else if (newMode === "all") {
      // Reset data for "all" mode
      const allData =
        dqCheckData?.filter((check: any) => check.all_questions) || [];
      setDQCheckData(allData);
    }

    setMode(newMode);
    navigate(`?mode=${newMode}`);
  };

  const handleModeNameChange = (val: string) => {
    if (val && !availableModuleNames.includes(val)) {
      setAvailableModuleNames((prevOptions) => [...prevOptions, val]);
      setModuleName(val);
    }
  };

  const handleAddCheck = () => {
    showAddManualDrawer();
    setDrawerData(null);
  };

  const handleEditCheck = () => {
    setDrawerData(selectedVariableRows[0]);
    showAddManualDrawer();
  };

  const handleMarkActive = () => {
    const selectedCheck = selectedVariableRows[0];

    const formData = {
      form_uid: formUID,
      type_id: typeID,
      all_questions: selectedCheck.allQuestions,
      module_name: selectedCheck.moduleName,
      question_name: selectedCheck.questionName,
      flag_description: selectedCheck.flagDescription,
      filters: selectedCheck.filters,
      active: true,
      check_components: { value: selectedCheck.value },
    };

    setLoading(true);
    putDQChecks(dqCheckData[0].dq_check_uid, formData).then((res: any) => {
      setLoading(false);
      if (res?.data?.success) {
        message.success("DQ Check activated", 1, () => {
          navigate(0);
        });
      }
    });
  };

  const handleMarkInactive = () => {
    const selectedCheck = selectedVariableRows[0];

    const formData = {
      form_uid: formUID,
      type_id: typeID,
      all_questions: selectedCheck.allQuestions,
      module_name: selectedCheck.moduleName,
      question_name: selectedCheck.questionName,
      flag_description: selectedCheck.flagDescription,
      filters: selectedCheck.filters,
      active: false,
      check_components: { value: selectedCheck.value },
    };

    setLoading(true);
    putDQChecks(dqCheckData[0].dq_check_uid, formData).then((res: any) => {
      setLoading(false);
      if (res?.data?.success) {
        message.success("DQ Check deactivated", 1, () => {
          navigate(0);
        });
      }
    });
  };

  const handleAllSave = () => {
    if (!formUID || !typeID) return;

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
        }
      });
    } else {
      if (!(dqCheckData.length > 0) || !dqCheckData[0].dq_check_uid) {
        message.error("DQ Check not found to update it.");
        return;
      }

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

  const isLoading = loading;

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <p style={{ color: "#8C8C8C", fontSize: 14 }}>
            Checks that certain variables have no missing values. By default,
            the following are considered missing: ‘ ’, NA, NAN, NULL (case
            insensitive)
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
                  <Form.Item label="Value is missing if value is:" />
                </Col>
                <Col span={6}>
                  <Select
                    mode="tags"
                    style={{ width: "100%" }}
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
                  <Form.Item label="Flag description:" />
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
                <Form.Item label="Filter data before applying this check:" />
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
                    />
                  </Col>
                  <Col span={6}>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select or input an option"
                      showSearch
                      value={moduleName}
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
                <Button style={{ marginLeft: 32 }}>Cancel</Button>
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
                  <Button style={{ marginLeft: 16 }} onClick={handleAddCheck}>
                    Add
                  </Button>
                  {selectedVariableRows.length === 1 && (
                    <Button
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
