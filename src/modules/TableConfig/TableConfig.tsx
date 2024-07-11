import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import Header from "../../components/Header";
import NavItems from "../../components/NavItems";
import Container from "../../components/Layout/Container";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getSurveyCTOForm } from "../../redux/surveyCTOInformation/surveyCTOInformationActions";
import NotFound from "../../components/NotFound";
import { Alert, Button, Checkbox, Input, Modal, Table, message } from "antd";
import TableCard from "./TableCard";
import { getTableConfig } from "../../redux/tableConfig/tableConfigActions";
import { RootState } from "../../redux/store";
import { properCase } from "../../utils/helper";
import { PlusOutlined } from "@ant-design/icons";
import SelectGroup from "./SelectGroup";
import { fetchEnumeratorsColumnConfig } from "../../redux/enumerators/apiService";
import { fetchTargetsColumnConfig } from "../../redux/targets/apiService";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  UniqueIdentifier,
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
  PreviewBtn,
  PreviewTable,
  SubmitBtn,
} from "./TableConfig.styled";
import { HeaderContainer, Title } from "../../shared/Nav.styled";
import { set } from "lodash";

function TableConfig() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get the table parameter from the URL
  const [searchParam] = useSearchParams();
  const table = searchParam.get("table");

  const { survey_uid, form_uid } = useParams<{
    survey_uid: string;
    form_uid: string;
  }>();

  // Ensure that the survey_uid are available
  if (!survey_uid) {
    return <NotFound />;
  }

  const { loading: isTableConfigLoading, data: tableConfig } = useAppSelector(
    (state: RootState) => state.tableConfig
  );

  const [config, setConfig] = useState<any>(null);
  const [addColModel, setAddColModel] = useState(false);

  // Enumerators and Targets columns
  const [enumeratorsColumn, setEnumeratorsColumn] = useState<any>(null);
  const [targetsColumn, setTargetsColumn] = useState<any>(null);
  const [previewTable, setPreviewTable] = useState<boolean>(false);

  const [groupLabels, setGroupLabels] = useState<string[]>([]);

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
    console.log("oldGroupColumns", oldGroupColumns);
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
      console.log("oldTableItems", oldTableItems);
      console.log("groupIndex", groupIndex);
      oldTableItems[groupIndex] = {
        ...oldTableItems[groupIndex],
        columns: filteredGroupColumns,
      };
      newConfig = { ...newConfig, [tableKey]: oldTableItems };
    }

    // Update the state
    setConfig(newConfig);
  };

  const handleAddGroup = (
    tableKey: string,
    groupIndex: number,
    colIndex: number
  ) => {
    console.log("Add Group", tableKey, groupIndex, colIndex);
    console.log("Config", config[tableKey]);
  };

  const tableDataSource = function () {
    if (config && Object.keys(config).length > 0) {
      if (table) {
        const tempD: any = [];
        const tableKey = table.toLowerCase();
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
                    style={{ width: 280 }}
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

  const [selectedEnumCols, setSelectedEnumCols] = useState<any>([]);
  const [selectedTargetCols, setSelectedTargetCols] = useState<any>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!table) return;
    const tableKey = table.toLowerCase();

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
  if (table) {
    console.log("config?.[table.toLowerCase()]", config?.[table.toLowerCase()]);
    previewTableColumns = config?.[table.toLowerCase()]?.map(
      (configItem: any, i: any) => {
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
      }
    );
  }

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
  }, []);

  // Fetch the table config on redux state
  useEffect(() => {
    if (form_uid) {
      dispatch(getTableConfig({ formUID: form_uid }));

      fetchEnumeratorsColumnConfig(form_uid).then((res: any) => {
        if (res.status === 200) {
          if (res.data.data) {
            const fileCols = res.data.data?.file_columns.map((item: any) => {
              return {
                column_key: item.column_name,
                column_label: item.column_name,
              };
            });

            const locationCols = res.data.data?.location_columns.map(
              (item: any) => ({
                column_key: item.column_key,
                column_label: item.column_label,
              })
            );

            const productivityCols = res.data.data?.productivity_columns.map(
              (item: any) => ({
                column_key: item.column_key,
                column_label: item.column_label,
              })
            );

            setEnumeratorsColumn([
              ...fileCols,
              ...locationCols,
              ...productivityCols,
            ]);
          }
        } else {
          message.error(
            "An error occurred while fetching the Enumerators column config"
          );
        }
      });

      fetchTargetsColumnConfig(form_uid).then((res: any) => {
        if (res.status === 200) {
          if (res.data.data) {
            const fileCols = res.data.data?.file_columns?.map((item: any) => {
              return {
                column_key: item.column_name,
                column_label: item.column_name,
              };
            });

            const locationCols = res.data.data?.location_columns?.map(
              (item: any) => ({
                column_key: item.column_key,
                column_label: item.column_label,
              })
            );

            const targetStatusCols = res.data.data?.target_status_columns?.map(
              (item: any) => ({
                column_key: item.column_key,
                column_label: item.column_label,
              })
            );

            setTargetsColumn([
              ...fileCols,
              ...locationCols,
              ...targetStatusCols,
            ]);
          }
        } else {
          message.error(
            "An error occurred while fetching the Enumerators column config"
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
    if (config && Object.keys(config).length > 0 && table) {
      const tableKey = table.toLowerCase();
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

    const selectedEnumColsTemp: any = enumeratorsColumn?.filter((item: any) => {
      if (table && config && config[table]) {
        return config[table].some((group: any) => {
          return group.columns.some((col: any) => {
            return col.column_key === item.column_key;
          });
        });
      }
    });
    setSelectedEnumCols(selectedEnumColsTemp);

    const selectedTargetColsTemp: any = targetsColumn?.filter((item: any) => {
      if (table && config && config[table]) {
        return config[table].some((group: any) => {
          return group.columns.some((col: any) => {
            return col.column_key === item.column_key;
          });
        });
      }
    });
    setSelectedTargetCols(selectedTargetColsTemp);
  }, [config, table, enumeratorsColumn, targetsColumn]);

  useEffect(() => {
    if (table && config && Object.keys(config).length > 0) {
      console.log("Config[table]", config[table.toLowerCase()]);
    }
  }, [config]);

  return (
    <>
      <Header items={NavItems} />
      {isTableConfigLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container />
          <HeaderContainer>
            <Title>Assignments Column Configuration</Title>
            <div style={{ marginLeft: "auto" }}>
              {table && previewTable === true ? (
                <>
                  <BackBtn onClick={() => setPreviewTable(false)}>
                    Back to editing
                  </BackBtn>
                  <SubmitBtn>Save table configuration</SubmitBtn>
                </>
              ) : null}
              {table && previewTable === false ? (
                <PreviewBtn onClick={() => setPreviewTable(true)}>
                  Preview and Save
                </PreviewBtn>
              ) : null}
            </div>
          </HeaderContainer>
          <div style={{ marginLeft: 36, marginTop: 24 }}>
            {table && config && Object.keys(config).length > 0 ? (
              <>
                {previewTable === true ? (
                  <>
                    <Alert
                      message="Scroll horizontally to view all columns."
                      type="info"
                      showIcon
                      style={{ marginBottom: 16, marginRight: 24 }}
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
                        <Table
                          components={{
                            body: {
                              row: DraggableRow,
                            },
                          }}
                          rowKey="key"
                          columns={tableColumns}
                          dataSource={tableDataSource()}
                          pagination={false}
                        />
                      </SortableContext>
                    </DndContext>
                    <Button
                      style={{ marginTop: 16 }}
                      icon={<PlusOutlined />}
                      onClick={() => setAddColModel(true)}
                    >
                      Add / Remove Column
                    </Button>
                  </>
                )}
              </>
            ) : (
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
            )}
          </div>
          <Modal
            open={addColModel}
            title="Title"
            okText="Add Column"
            width={900}
            onCancel={() => setAddColModel(false)}
          >
            <p>Enumerator</p>
            <Checkbox.Group
              options={enumeratorsColumn?.map((item: any) => item.column_key)}
              defaultValue={selectedEnumCols?.map(
                (item: any) => item.column_key
              )}
            />
            <p>Targets</p>
            <Checkbox.Group
              options={targetsColumn?.map((item: any) => item.column_key)}
              defaultValue={selectedTargetCols?.map(
                (item: any) => item.column_key
              )}
            />
          </Modal>
        </>
      )}
    </>
  );
}

export default TableConfig;
