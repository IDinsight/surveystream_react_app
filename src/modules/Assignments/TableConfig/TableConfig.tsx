import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";

import Container from "../../../components/Layout/Container";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getSurveyCTOForm } from "../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import NotFound from "../../../components/NotFound";
import { properCase } from "../../../utils/helper";
import {
  Alert,
  Button,
  Checkbox,
  Col,
  Input,
  Modal,
  Row,
  Select,
  message,
} from "antd";
import TableCard from "./TableCard";
import {
  getTableConfig,
  updateTableConfig,
} from "../../../redux/tableConfig/tableConfigActions";
import { RootState } from "../../../redux/store";
import { PlusOutlined } from "@ant-design/icons";
import SelectGroup from "./SelectGroup";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableRow from "./DraggableRow";
import {
  BackBtn,
  ColumnsTable,
  PreviewBtn,
  PreviewTable,
  SubmitBtn,
} from "./TableConfig.styled";
import { HeaderContainer, Title } from "../../../shared/Nav.styled";
import { fetchAvailableColumn } from "../../../redux/tableConfig/apiService";
import { Breadcrumb } from "antd";
import { CustomBtn } from "../../../shared/Global.styled";

function TableConfig() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get the table parameter from the URL
  const [searchParam] = useSearchParams();
  const table = searchParam.get("table");
  const tableKey = table?.toLowerCase();

  const { survey_uid, form_uid } = useParams<{
    survey_uid: string;
    form_uid: string;
  }>();

  const {
    loading: isTableConfigLoading,
    data: tableConfig,
    err: tableLoadingError,
  } = useAppSelector((state: RootState) => state.tableConfig);

  const [config, setConfig] = useState<any>(null);
  const [previewTable, setPreviewTable] = useState<boolean>(false);

  const [availableColumns, setAvailableColumns] = useState<any>([]);
  const [sctoColumns, setSctoColumns] = useState<any>([]);
  const [otherColumns, setOtherColumns] = useState<any>([]);

  const [selectedColumns, setSelectedColumns] = useState<any>([]);
  const [selectedSctoColumns, setSelectedSctoColumns] = useState<any>([]);
  const [selectedOtherColumns, setSelectedOtherColumns] = useState<any>([]);

  const [groupLabels, setGroupLabels] = useState<string[]>([]);
  const [addColModel, setAddColModel] = useState(false);

  const [respError, setRespError] = useState<string[] | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  const tableColumns = [
    {
      title: "Available Columns",
      dataIndex: "available_col",
      key: "available_col",
    },
    {
      title: "Column Label",
      dataIndex: "col_label",
      key: "col_label",
    },
    {
      title: "Group",
      dataIndex: "group",
      key: "group",
    },
  ];

  // Handling the input change in Column Label
  const handleInputChange = (
    tableKey: string,
    groupIndex: number,
    columnIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const newVal = e.target.value;
    const newConfig = {
      ...config,
      [tableKey]: [
        ...config[tableKey].map((item: any, idx: number) => {
          if (idx === groupIndex) {
            return {
              ...item,
              columns: [
                ...item.columns.map((col: any, colIdx: number) => {
                  if (colIdx === columnIndex) {
                    return {
                      ...col,
                      column_label: newVal,
                    };
                  }
                  return col;
                }),
              ],
            };
          }
          return item;
        }),
      ],
    };

    // Update the state
    setConfig(newConfig);
  };

  const handleSelectChange = (
    tableKey: string,
    groupIndex: number,
    colIndex: number,
    gName: string | null
  ) => {
    let newConfig = { ...config };
    const colItem = newConfig[tableKey][groupIndex].columns[colIndex];

    // Find the group index for insertion
    const newGroupIndex = newConfig[tableKey].findIndex(
      (group: any) => group.group_label === gName
    );

    // If the group does not exist, create a new group
    if (gName === null || newGroupIndex === -1) {
      newConfig = {
        ...newConfig,
        [tableKey]: [
          ...newConfig[tableKey],
          { group_label: gName, columns: [colItem] },
        ],
      };
    } else {
      // Otherwise, add the column to the existing group
      const currentColumns = [...newConfig[tableKey][newGroupIndex].columns];
      currentColumns.push(colItem);
      const tableItems = [...newConfig[tableKey]];
      tableItems[newGroupIndex] = {
        ...tableItems[newGroupIndex],
        columns: currentColumns,
      };
      newConfig = { ...newConfig, [tableKey]: tableItems };
    }

    // Remove the column from the previous group
    const oldGroupColumns = [...newConfig[tableKey][groupIndex].columns];
    const filteredGroupColumns = oldGroupColumns.filter(
      (col: any, i: number) => i !== colIndex
    );
    if (filteredGroupColumns.length === 0) {
      const filteredTableItems = newConfig[tableKey].filter(
        (group: any, i: number) => i !== groupIndex
      );
      newConfig = { ...newConfig, [tableKey]: filteredTableItems };
    } else {
      const oldTableItems = [...newConfig[tableKey]];
      oldTableItems[groupIndex] = {
        ...oldTableItems[groupIndex],
        columns: filteredGroupColumns,
      };
      newConfig = { ...newConfig, [tableKey]: oldTableItems };
    }

    // Update the state
    setConfig(newConfig);
  };

  const tableDataSource = function () {
    if (config && Object.keys(config).length > 0) {
      if (tableKey) {
        const tempD: any = [];
        try {
          config[tableKey].forEach((item: any, itemIdx: number) => {
            // Loop through the columns
            item.columns.forEach((col: any, colIdx: number) => {
              tempD.push({
                key: col.column_key,
                available_col: col.column_key,
                col_label: (
                  <Input
                    value={col.column_label}
                    style={{ width: 280, fontFamily: '"Lato", sans-serif' }}
                    onChange={(e) =>
                      handleInputChange(tableKey, itemIdx, colIdx, e)
                    }
                  />
                ),
                group: (
                  <SelectGroup
                    label={item.group_label}
                    groups={groupLabels}
                    setGroup={setGroupLabels}
                    onSelectChange={(value: string | null) =>
                      handleSelectChange(tableKey, itemIdx, colIdx, value)
                    }
                  />
                ),
              });
            });
          });
          return tempD;
        } catch (error) {
          message.error("An error occurred while generating the table");
        }
      }
    } else {
      return [];
    }
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!tableKey) return;

    // Make sure the active and over columns are different
    if (active.id !== over?.id) {
      setConfig((prev: any) => {
        // Create a deep copy of the config
        const newConfig = JSON.parse(JSON.stringify(prev));

        // Find the active and over groups and columns
        let activeGroupIndex,
          activeColumnIndex,
          overGroupIndex,
          overColumnIndex;

        newConfig[tableKey].forEach((group: any, index: number) => {
          group.columns.forEach((column: any, columnIndex: number) => {
            if (column.column_key === active.id) {
              activeGroupIndex = index;
              activeColumnIndex = columnIndex;
            }
            if (column.column_key === over?.id) {
              overGroupIndex = index;
              overColumnIndex = columnIndex;
            }
          });
        });

        // If either group wasn't found, return the original config
        if (activeGroupIndex === undefined || overGroupIndex === undefined) {
          return prev;
        }

        /*
         * If the active group has a label, move the entire group.
         * Otherwise, move the individual column
         */
        if (newConfig[tableKey][activeGroupIndex].group_label) {
          // If the active group is not the same as the over group
          if (activeGroupIndex !== overGroupIndex) {
            const [activeGroup] = newConfig[tableKey].splice(
              activeGroupIndex,
              1
            );
            newConfig[tableKey].splice(overGroupIndex, 0, activeGroup);
          } else {
            if (
              activeColumnIndex === undefined ||
              overColumnIndex === undefined
            ) {
              return prev;
            }

            // Otherwise, move the column within the same group
            const newColumns = arrayMove(
              newConfig[tableKey][activeGroupIndex].columns,
              activeColumnIndex,
              overColumnIndex
            );
            newConfig[tableKey][activeGroupIndex].columns = newColumns;
          }
        } else {
          const newColumns = arrayMove(
            newConfig[tableKey],
            activeGroupIndex,
            overGroupIndex
          );
          newConfig[tableKey] = newColumns;
        }
        return newConfig;
      });
    }
  };

  // Create the preview table columns based on the config
  let previewTableColumns = undefined;
  if (tableKey) {
    previewTableColumns = config?.[tableKey]?.map((configItem: any, i: any) => {
      if (configItem.group_label) {
        return {
          title: configItem.group_label,
          children: configItem.columns.map((groupItem: any, i: any) => {
            return {
              title: groupItem.column_label,
              dataIndex: groupItem.column_key,
              key: groupItem.column_key,
            };
          }),
        };
      } else {
        return {
          title: configItem.columns[0].column_label,
          dataIndex: configItem.columns[0].column_key,
          key: configItem.columns[0].column_key,
        };
      }
    });
  }

  const handleColumnChange = () => {
    // Check if the table key is available
    if (!tableKey) return;

    // Close the modal
    setAddColModel(false);

    // Create a copy of the config
    const newConfig = JSON.parse(JSON.stringify(config));

    // Combine the selected scto and other columns
    const newUpdatedColumns = [...selectedSctoColumns, ...selectedOtherColumns];

    // Create a Set of new column keys for easy lookup
    const updatedColumnKeys = new Set(
      newUpdatedColumns.map((col) => col.value)
    );

    // Remove columns not in the newUpdatedColumns array and groups with zero columns
    const filteredConfig = newConfig[tableKey].filter((group: any) => {
      group.columns = group.columns.filter((col: any) =>
        updatedColumnKeys.has(col.column_key)
      );
      return group.columns.length > 0;
    });

    // Collect existing column keys from the updated config
    const existingColumnKeys = new Set();
    filteredConfig.forEach((group: any) => {
      group.columns.forEach((col: any) =>
        existingColumnKeys.add(col.column_key)
      );
    });

    // Append new columns with group_label null that are not already in the config
    const columnsToAppend = newUpdatedColumns.filter(
      (newCol) => !existingColumnKeys.has(newCol.value)
    );

    if (columnsToAppend.length > 0) {
      columnsToAppend.map((col: any) => {
        filteredConfig.push({
          group_label: null,
          columns: [{ column_key: col.value, column_label: col.label }],
        });
      });
    }

    // Update the config
    newConfig[tableKey] = filteredConfig;
    setConfig(newConfig);
  };

  // Set the default selected columns
  const setDefaultSelectedCols = () => {
    const selectedSctoCols = sctoColumns?.filter((col: any) =>
      selectedColumns?.some((colItem: any) => colItem.column_key === col.value)
    );
    setSelectedSctoColumns(selectedSctoCols);

    const selectedOtherCols = otherColumns?.filter((col: any) =>
      selectedColumns?.some((colItem: any) => colItem.column_key === col.value)
    );
    setSelectedOtherColumns(selectedOtherCols);
  };

  const handleSaveBtn = () => {
    if (form_uid && tableKey && config) {
      // Flatten the table config for payload
      const flatTableConfig: any = [];
      config[tableKey].forEach((group: any) => {
        group.columns.map((col: any) => {
          flatTableConfig.push({
            group_label: group.group_label,
            column_key: col.column_key,
            column_label: col.column_label,
          });
        });
      });

      dispatch(
        updateTableConfig({
          formUID: form_uid,
          tableName: tableKey,
          tableConfig: flatTableConfig,
        })
      ).then((res: any) => {
        if (res.payload.success) {
          message.success("Table configuration saved successfully");

          navigate(
            `/module-configuration/table-config/${survey_uid}/${form_uid}`
          );

          setPreviewTable(false);
          dispatch(getTableConfig({ formUID: form_uid }));
        } else {
          if (res?.payload?.errors) {
            setRespError(res.payload.errors);
          }
          message.error(
            "An error occurred while saving the table configuration"
          );
        }
      });
    } else {
      message.error("An error occurred while saving the table configuration");
    }
  };

  // Ensure that the form_uid is available
  useEffect(() => {
    if (survey_uid == "" || survey_uid == undefined) return;
    if (form_uid == "" || form_uid == undefined) {
      const resp = dispatch(getSurveyCTOForm({ survey_uid }));
      resp.then((res) => {
        const formUid = res.payload[0]?.form_uid;
        if (formUid) {
          navigate(
            `/module-configuration/table-config/${survey_uid}/${formUid}`
          );
        }
      });
    }
  }, [survey_uid, form_uid]);

  // Fetch the table config on redux state
  useEffect(() => {
    if (form_uid) {
      dispatch(getTableConfig({ formUID: form_uid }));

      fetchAvailableColumn(form_uid).then((res: any) => {
        if (res.status === 200) {
          if (res.data) {
            setAvailableColumns(res.data);
          }
        } else {
          message.error(
            "An error occurred while fetching the available column"
          );
        }
      });
    }
  }, [form_uid]);

  // Set the config once the table config data is available
  useEffect(() => {
    if (!isTableConfigLoading && tableConfig) {
      setConfig(tableConfig);
    }
  }, [isTableConfigLoading, tableConfig]);

  // Get the group labels and set the state
  useEffect(() => {
    const groupLabelsTemp: any = [];
    if (config && Object.keys(config).length > 0 && tableKey) {
      try {
        config[tableKey].forEach((item: any) => {
          // Check if the group label is available
          if (item.group_label) {
            groupLabelsTemp.push(item.group_label);
          }
        });
        setGroupLabels(groupLabelsTemp);
      } catch (error) {
        message.error("An error occurred while gathering the group labels");
      }
    }
  }, [config, tableKey]);

  // Set the selected columns
  useEffect(() => {
    let selectedCols: any = [];
    if (tableKey) {
      selectedCols = availableColumns[tableKey]?.filter((item: any) => {
        if (tableKey && config && config[tableKey]) {
          return config[tableKey].some((group: any) => {
            return group.columns.some((col: any) => {
              return col.column_key === item.column_key;
            });
          });
        }
      });
    }
    setSelectedColumns(selectedCols);
  }, [config, availableColumns, tableKey]);

  // Set the SCTO and other columns
  useEffect(() => {
    const sctoCols: any = [];
    const otherCols: any = [];

    if (tableKey && availableColumns[tableKey]) {
      availableColumns[tableKey].forEach((item: any) => {
        if (item.column_key.startsWith("scto_")) {
          sctoCols.push({
            label: item.column_label,
            value: item.column_key,
          });
        } else {
          otherCols.push({
            label: item.column_label,
            value: item.column_key,
          });
        }
      });
    }

    setSctoColumns(sctoCols);
    setOtherColumns(otherCols);
  }, [tableKey, availableColumns]);

  useEffect(() => {
    setDefaultSelectedCols();
  }, [selectedColumns, sctoColumns, otherColumns]);

  // Ensure that the survey_uid are available
  if (!survey_uid) {
    return <NotFound />;
  }

  return (
    <>
      {isTableConfigLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container surveyPage={true} />
          <HeaderContainer>
            <Breadcrumb
              separator=">"
              style={{ fontSize: "16px", color: "#000" }}
              items={[
                {
                  title: "Assignments Column Configuration",
                  href: tableKey
                    ? `/module-configuration/table-config/${survey_uid}/${form_uid}`
                    : undefined,
                },
                ...(tableKey
                  ? [
                      {
                        title: properCase(tableKey.replace("_", " ")),
                      },
                    ]
                  : []),
              ]}
            />
            <div style={{ marginLeft: "auto" }}>
              {table && previewTable === true ? (
                <>
                  <BackBtn
                    onClick={() => {
                      setPreviewTable(false);
                      setRespError(null);
                    }}
                  >
                    Back to editing
                  </BackBtn>
                  <SubmitBtn onClick={handleSaveBtn}>
                    Save table configuration
                  </SubmitBtn>
                </>
              ) : null}
              {table && previewTable === false ? (
                <PreviewBtn onClick={() => setPreviewTable(true)}>
                  Preview and Save
                </PreviewBtn>
              ) : null}
              {!table ? (
                <CustomBtn
                  onClick={() => {
                    navigate(
                      `/module-configuration/assignments/${survey_uid}/${form_uid}`
                    );
                  }}
                >
                  Go back to Assignments
                </CustomBtn>
              ) : null}
            </div>
          </HeaderContainer>
          <div style={{ marginLeft: 36, marginTop: 24 }}>
            {tableKey && config && Object.keys(config).length > 0 ? (
              <>
                {previewTable === true ? (
                  <>
                    {respError !== null ? (
                      <Alert
                        message="An error occurred while updating the table configuration"
                        description={
                          Array.isArray(respError) ? (
                            <ul>
                              {respError.map((err, idx) => (
                                <li key={idx}>{err}</li>
                              ))}
                            </ul>
                          ) : (
                            respError
                          )
                        }
                        type="error"
                        showIcon
                        style={{ marginRight: 24, marginBottom: 24 }}
                      />
                    ) : null}
                    <Alert
                      message="Scroll horizontally to view all columns."
                      type="info"
                      showIcon
                      style={{
                        marginBottom: 16,
                        marginRight: 24,
                        fontFamily: '"Lato", sans-serif',
                      }}
                    />
                    <PreviewTable
                      columns={previewTableColumns}
                      pagination={false}
                      bordered={true}
                      scroll={{ x: 2500 }}
                    />
                  </>
                ) : (
                  <>
                    <DndContext
                      sensors={sensors}
                      modifiers={[restrictToVerticalAxis]}
                      onDragEnd={onDragEnd}
                    >
                      <SortableContext
                        items={tableDataSource().map((i: any) => i.key)}
                        strategy={verticalListSortingStrategy}
                      >
                        <ColumnsTable
                          components={{
                            body: {
                              row: DraggableRow,
                            },
                          }}
                          rowKey="key"
                          columns={tableColumns}
                          dataSource={tableDataSource()}
                          pagination={false}
                          style={{ fontFamily: '"Lato", sans-serif' }}
                        />
                      </SortableContext>
                    </DndContext>
                    <Button
                      style={{
                        marginTop: 16,
                        marginBottom: 36,
                        fontFamily: '"Lato", sans-serif',
                      }}
                      icon={<PlusOutlined />}
                      onClick={() => setAddColModel(true)}
                    >
                      Add / Remove Column
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                {tableLoadingError === null ? (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      marginRight: 24,
                    }}
                  >
                    <TableCard
                      title="Targets"
                      description="Selected columns will be visible for Targets table for
                    assignments."
                      btnLabel="View configuration"
                    />
                    <TableCard
                      title="Surveyors"
                      description="Selected columns will be visible for surveyors table for
                  assignments."
                      btnLabel="View configuration"
                    />
                    <TableCard
                      title="Assignments Main"
                      description="Selected columns will be visible for assignments table for assignments."
                      btnLabel="View configuration"
                    />
                    <TableCard
                      title="Assignments Surveyors"
                      description="Selected columns will be visible for ‘assignments surveyors’ table for assignments."
                      btnLabel="View configuration"
                    />
                    <TableCard
                      title="Assignments Review"
                      description="Selected columns will be visible for ‘assignments review’ for assignments"
                      btnLabel="View configuration"
                    />
                  </div>
                ) : (
                  <Alert
                    message="An error occurred while fetching the table configuration"
                    description={
                      Array.isArray(tableLoadingError["errors"])
                        ? (tableLoadingError["errors"] as string[])?.join(", ")
                        : tableLoadingError["errors"]
                    }
                    type="error"
                    showIcon
                    style={{ marginRight: 24 }}
                  />
                )}
              </>
            )}
          </div>
          <Modal
            open={addColModel}
            title="Add or Remove Columns"
            okText="Modify Column"
            okButtonProps={{
              type: "default",
              style: {
                fontFamily: '"Lato", sans-serif',
                backgroundColor: "#597ef7",
                color: "white",
              },
            }}
            width={900}
            onCancel={() => {
              setDefaultSelectedCols();
              setAddColModel(false);
            }}
            onOk={handleColumnChange}
          >
            <Checkbox.Group
              style={{ marginTop: 16 }}
              value={selectedOtherColumns.map((col: any) => col.value)}
              onChange={(value) => {
                const selectedCols = otherColumns.filter((col: any) =>
                  value.includes(col.value)
                );
                setSelectedOtherColumns(selectedCols);
              }}
            >
              <Row gutter={[16, 16]}>
                {otherColumns.map((option: any) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={option.value}>
                    <Checkbox
                      value={option.value}
                      style={{ fontFamily: '"Lato", sans-serif' }}
                    >
                      {option.label}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
            {sctoColumns.length > 0 ? (
              <div style={{ marginTop: 24, marginBottom: 32 }}>
                <p style={{ fontFamily: '"Lato", sans-serif' }}>
                  SCTO columns:
                </p>
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select SCTO fields"
                  value={selectedSctoColumns.map((col: any) => col.value)}
                  options={sctoColumns}
                  onChange={(value: string[]) => {
                    const selectedCols = sctoColumns.filter((col: any) =>
                      value.includes(col.value)
                    );
                    setSelectedSctoColumns(selectedCols);
                  }}
                />
              </div>
            ) : null}
          </Modal>
        </>
      )}
    </>
  );
}

export default TableConfig;
