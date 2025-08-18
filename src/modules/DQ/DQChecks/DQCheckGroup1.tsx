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
import { isEqual } from "lodash";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { ChecksTable, ChecksSwitch } from "./DQChecks.styled";
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
import DQCheckDrawer from "../../../components/DQCheckDrawer/DQCheckDrawer";
import { ClearOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { CustomBtn, DescriptionText } from "../../../shared/Global.styled";
import DescriptionLink from "../../../components/DescriptionLink";

interface IDQCheckGroup1Props {
  surveyUID: string;
  formUID: string;
  typeID: string;
}

function DQCheckGroup1({ surveyUID, formUID, typeID }: IDQCheckGroup1Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [searchParam] = useSearchParams();
  const modeParam = searchParam.get("mode");

  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [mode, setMode] = useState<string | null>(null);

  const [tablePageSize, setTablePageSize] = useState(5);

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

  const defaultValues = {
    "4": ["''", "NA", "NAN", "NULL"],
    "5": ["-888"],
    "6": ["-999"],
    "11": ["99"],
  };

  // Table columns for mode selected
  const columns = [
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
    value: check.check_components.value,
    status: check.active ? "Active" : "Inactive",
    filters: check.filters,
    isDeleted:
      check.note === "Question not found in form definition" ||
      check.note === "Filter question not found in form definition",
    isRepeatGroup: check.is_repeat_group,
  }));

  const handleModeChange = (e: RadioChangeEvent) => {
    const newMode = e.target.value;
    if (newMode === mode) return;

    if (dqCheckData === null) {
      navigate(`?mode=${newMode}`);
      return;
    }

    Modal.confirm({
      title: "Are you sure?",
      content: `This action will delete the ${mode} variable checks and cannot be undone. Do you want to proceed?`,
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        navigate(`?mode=${newMode}`);
      },
    });
  };

  const handleModeNameChange = (val: string) => {
    if (val && !availableModuleNames.includes(val)) {
      setAvailableModuleNames((prevOptions) => [...prevOptions, val]);
      setModuleName(val);
    }
  };

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
        all_questions: mode === "all" ? true : false,
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
      module_name: data.module_name || "",
      question_name: data.variable_name,
      flag_description: data.flag_description || "",
      filters: data.filters,
      active: data.is_active,
      check_components: { value: data.check_values },
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

  // Set mode based on URL param
  useEffect(() => {
    if (modeParam && ["all", "selected"].includes(modeParam)) {
      setMode(modeParam);
    }
  }, [modeParam]);

  const loadDQChecks = () => {
    if (typeID) {
      setLoading(true);
      getDQChecks(formUID, typeID)
        .then((res: any) => {
          if (res?.data?.success) {
            const checkAllData = res.data.data;

            if (
              checkAllData.length === 1 &&
              checkAllData[0].all_questions === true
            ) {
              if (!modeParam && !mode) {
                navigate(`?mode=all`);
              }

              // Mode is "all"
              if (mode === "all") {
                setIsActive(checkAllData[0].active);
                setModuleName(checkAllData[0].module_name);
                setFlagDescription(checkAllData[0].flag_description);
                setCheckValues(checkAllData[0].check_components.value);
                setFilterData(checkAllData[0].filters);
                setDQCheckData([checkAllData[0]]);
                setDataLoading(false);
              } else if (modeParam === "selected") {
                // Clear data for "selected" mode when all_questions is true
                setDQCheckData([]);
                setDataLoading(false);
              }
            } else {
              if (!modeParam && !mode) {
                navigate(`?mode=selected`);
              }

              // Mode is "selected"
              if (mode === "selected") {
                const selectedData = checkAllData.filter(
                  (check: any) => !check.all_questions
                );
                setDQCheckData(selectedData);
                setDataLoading(false);
              } else if (modeParam === "all") {
                // Fallback for "all" mode
                setDQCheckData(
                  checkAllData.filter((check: any) => check.all_questions)
                );
                setDataLoading(false);
              }
            }
          } else {
            // In case of no data from API, set the mode to "all"
            const checkAllData = res?.response?.data?.data;
            if (checkAllData === null && !modeParam) {
              navigate(`?mode=all`);
            }
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
  }, [formUID, typeID, mode, modeParam]);

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
          <DescriptionText>
            {typeID === "4" &&
              "Checks whether certain variables have a high percentage of missing values. By default, the following are considered missing: ‘ ’, NA, NAN, NULL (caseinsensitive). "}
            {typeID === "5" &&
              "Checks whether certain variables have a high percentage of don’t know values. By default, -888 is considered as don’t know. "}
            {typeID === "6" &&
              "Checks whether certain variables have a high percentage of refusal values. By default, -999 is considered as refusal. "}
            {typeID === "11" &&
              "Checks whether certain variables have a high percentage of other values. By default, 99 is considered as other. "}

            <DescriptionLink
              link={
                "https://docs.surveystream.idinsight.io/hfc_configuration#missings-dont-knows-and-refusals"
              }
            />
          </DescriptionText>
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
                <Col span={5}>
                  <Form.Item
                    label={`Value is ${
                      typeID === "4"
                        ? "'missing'"
                        : typeID === "5"
                        ? "'don't knows'"
                        : typeID === "6"
                        ? "'refusal'"
                        : "'other'"
                    } if value is:`}
                    tooltip="Value that is considered for checks"
                    required
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
                        : typeID === "6"
                        ? "-999"
                        : "99"
                    }
                    value={checkValues}
                    options={[
                      ...new Set([
                        ...defaultValues[typeID as keyof typeof defaultValues],
                        ...checkValues,
                      ]),
                    ].map((option: any) => ({
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
                <Col span={5}>
                  <Form.Item
                    label="Flag description:"
                    tooltip="Short description of the flag that will be included in the outputs"
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
              {dqConfig?.group_by_module_name ? (
                <div>
                  <Row>
                    <Form.Item
                      label="Group variables in the output data using:"
                      tooltip="This input is enabled as per selection in - Step 1: Global configuration."
                    />
                  </Row>
                  <Row>
                    <Col span={4}>
                      <Form.Item
                        label="Module Name:"
                        style={{ marginLeft: 32 }}
                        tooltip="Will be included in the outputs and can be used to filter and group the results. If left blank, default value 'DQ' will be used."
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
              ) : null}
              <div>
                <Button
                  style={{ marginTop: 20 }}
                  onClick={() =>
                    navigate(
                      `/module-configuration/dq-checks/${surveyUID}/manage?form_uid=${formUID}`
                    )
                  }
                >
                  Cancel
                </Button>
                <CustomBtn style={{ marginLeft: 20 }} onClick={handleAllSave}>
                  Save
                </CustomBtn>
              </div>
            </>
          )}
          {mode === "selected" && (
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
                  <CustomBtn
                    style={{ marginLeft: 16 }}
                    onClick={handleAddCheck}
                  >
                    Add
                  </CustomBtn>
                  <CustomBtn
                    style={{ marginLeft: 16 }}
                    onClick={handleBulkAddCheck}
                  >
                    Bulk Add
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
              <DQCheckDrawer
                visible={isAddManualDrawerVisible}
                drawerMode={drawerMode}
                questions={availableQuestions}
                showModuleName={dqConfig?.group_by_module_name}
                moduleNames={availableModuleNames}
                data={drawerData}
                variablesValues={[
                  ...new Set([
                    ...defaultValues[typeID as keyof typeof defaultValues],
                    ...variablesValues,
                  ]),
                ]}
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
