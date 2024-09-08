import {
  DeleteFilled,
  PlusCircleFilled,
  PlusSquareFilled,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Input,
  message,
  Modal,
  Row,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { getTableCatalog } from "../../redux/emails/apiService";
import FullScreenLoader from "../Loaders/FullScreenLoader";

const { Option } = Select;

interface EmailTableModelProps {
  open: boolean;
  setOpen: any;
  surveyUID: string;
  tableList: any[];
  setTableList: any;
  editingIndex: null | number;
  setEditingIndex: any;
  insertText: any;
}

function EmailTableModel({
  open,
  setOpen,
  surveyUID,
  tableList,
  setTableList,
  editingIndex,
  setEditingIndex,
  insertText,
}: EmailTableModelProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [tableCatelog, setTableCatelog] = useState<any[]>([]);
  const [availableColumns, setAvailableColumns] = useState<any[]>([]);

  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<any>({});

  const [filterList, setFilterList] = useState<any[]>([]);
  const [sortList, setSortList] = useState<any[]>([]);

  const validateOperator = [
    "Is",
    "Is not",
    "Contains",
    "Does not contain",
    "Is empty",
    "Is not empty",
  ];

  const handleCheckboxChange = (column: any) => {
    setSelectedColumns((prev: any) => ({
      ...prev,
      [column]: {
        ...prev[column],
        selected: !prev[column]?.selected,
        text: column,
      },
    }));
  };

  const handleColumnInputChange = (column: any, text: any) => {
    setSelectedColumns((prev: any) => ({
      ...prev,
      [column]: {
        ...prev[column],
        text,
      },
    }));
  };

  const handleAddFilterGroup = () => {
    setFilterList((prev) => [
      ...prev,
      {
        filter_group: [
          {
            column: null,
            type: null,
            value: null,
            condition: null,
          },
        ],
      },
    ]);
  };

  const handleRemoveFilterGroup = (groupIndex: number) => {
    setFilterList((prev) => prev.filter((_, i) => i !== groupIndex));
  };

  const handleAddCondition = (groupIndex: number) => {
    setFilterList((prev) =>
      prev.map((group, i) =>
        i === groupIndex
          ? {
              ...group,
              filter_group: [
                ...group.filter_group,
                { column: null, type: null, value: null, condition: "OR" },
              ],
            }
          : group
      )
    );
  };

  const handleFilterFieldChange = (
    groupIndex: number,
    filterIndex: number,
    field: string,
    value: any
  ) => {
    setFilterList((prev) =>
      prev.map((group, i) =>
        i === groupIndex
          ? {
              ...group,
              filter_group: group.filter_group.map((filter: any, j: any) =>
                j === filterIndex ? { ...filter, [field]: value } : filter
              ),
            }
          : group
      )
    );
  };

  const handleRemoveFilter = (groupIndex: number, filterIndex: number) => {
    setFilterList((prev) =>
      prev
        .map((group, i) => {
          if (i === groupIndex) {
            const updatedFilterGroup = group.filter_group.filter(
              (_: any, j: any) => j !== filterIndex
            );
            return updatedFilterGroup.length > 0
              ? { ...group, filter_group: updatedFilterGroup }
              : null;
          }
          return group;
        })
        .filter((group) => group !== null)
    );
  };

  const handleAddSort = () => {
    setSortList((prev) => [
      ...prev,
      {
        column: null,
        mode: null,
      },
    ]);
  };

  const handleRemoveSort = (index: number) => {
    setSortList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSortChange = (
    value: string,
    index: number,
    key: "column" | "mode"
  ) => {
    setSortList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const handleSubmit = () => {
    // 1. Check if a table is selected
    if (!selectedTable) {
      message.error("Please select a table.");
      return;
    }

    // 2. Check if at least one column is selected
    const selectedColumnKeys = Object.keys(selectedColumns).filter(
      (key) => selectedColumns[key].selected
    );
    if (selectedColumnKeys.length === 0) {
      message.error("Please select at least one column.");
      return;
    }

    // 3. Check if all selected columns have a display name
    for (const key of selectedColumnKeys) {
      if (!selectedColumns[key].text) {
        message.error(`Display name for column ${key} cannot be empty.`);
        return;
      }
    }

    // 4. Check if all filters in filter groups are valid
    for (const group of filterList) {
      for (const filter of group.filter_group) {
        if (!filter.column || !filter.type) {
          message.error("Each filter must have a column and a type.");
          return;
        }
      }
    }

    // 5. Check if all sorting rows are valid
    for (const sort of sortList) {
      if (!sort.column || !sort.mode) {
        message.error("Each sort must have a column and a sort type.");
        return;
      }
    }

    const column_mapping: any = {};
    for (const key of selectedColumnKeys) {
      column_mapping[key] = selectedColumns[key].text;
    }

    const sort_list: any = {};
    for (const sort of sortList) {
      sort_list[sort.column] = sort.mode;
    }

    const filter_list = filterList.map((group) => ({
      filter_group: group.filter_group.map((filter: any) => ({
        table_name: selectedTable,
        filter_variable: filter.column,
        filter_operator: filter.type,
        filter_value: filter.value,
        filter_concatenator: filter.condition || undefined,
      })),
    }));

    let variable_name = "";
    if (editingIndex !== null && tableList[editingIndex].variable_name) {
      variable_name = tableList[editingIndex].variable_name;
    } else {
      variable_name = `Table_${tableList.length + 1}`;
      insertText(`{{${variable_name}}}`);
    }

    // Combine all parts into the final structure
    const result = {
      table_name: selectedTable,
      column_mapping,
      sort_list,
      variable_name,
      filter_list,
    };

    if (editingIndex !== null) {
      tableList[editingIndex] = result;
      setTableList([...tableList]);
    } else {
      setTableList((prev: any) => [...prev, result]);
    }

    // Reset the form on successful submission
    setSelectedTable(null);
    setSelectedColumns({});
    setFilterList([]);
    setSortList([]);
    setEditingIndex(null);
    setOpen(false);
  };

  // Getting the table catalog
  useEffect(() => {
    if (surveyUID) {
      setLoading(true);
      getTableCatalog(surveyUID)
        .then((res: any) => {
          setLoading(false);
          if (res.status === 200 && res.data.success) {
            // Set the table catalog
            setTableCatelog(res.data.data);
          }
        })
        .catch(() => {
          setLoading(false);
          message.error("Error fetching table catalog");
        });
    } else {
      message.error("Survey UID not found");
    }
  }, [surveyUID]);

  useEffect(() => {
    if (selectedTable && tableCatelog.length > 0) {
      const tableData = tableCatelog.find(
        (t) => t.table_name === selectedTable
      );
      setAvailableColumns(tableData.column_list);
    }
  }, [selectedTable]);

  useEffect(() => {
    if (tableList.length > 0 && editingIndex !== null) {
      const table = tableList[editingIndex];
      setSelectedTable(table.table_name);

      const column_mapping = table.column_mapping;
      const sort_list = table.sort_list;
      const filter_list = table.filter_list;

      const selectedColumns: any = {};
      for (const key of Object.keys(column_mapping)) {
        selectedColumns[key] = {
          selected: true,
          text: column_mapping[key],
        };
      }
      setSelectedColumns(selectedColumns);

      const filterList = filter_list.map((group: any) => ({
        filter_group: group.filter_group.map((filter: any) => ({
          column: filter.filter_variable,
          type: filter.filter_operator,
          value: filter.filter_value,
          condition: filter.filter_concatenator,
        })),
      }));
      setFilterList(filterList);

      const sortList = Object.keys(sort_list).map((key) => ({
        column: key,
        mode: sort_list[key],
      }));
      setSortList(sortList);
    }
  }, [tableList, editingIndex]);

  return (
    <Modal
      width="100%"
      open={open}
      title="Insert table"
      onCancel={() => {
        setSelectedTable(null);
        setSelectedColumns({});
        setFilterList([]);
        setSortList([]);
        setOpen(false);
      }}
      onOk={handleSubmit}
      okText="Save"
    >
      {loading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ height: "350px", overflowY: "auto" }}>
          <div style={{ marginBottom: 16 }}>
            <p>Select tables to insert them in the email table</p>
            <Row>
              <Col span={6}>
                <Select
                  placeholder="Select table"
                  style={{ width: "100%" }}
                  value={selectedTable}
                  onChange={(val) => setSelectedTable(val)}
                >
                  {tableCatelog.map((table) => (
                    <Option key={table.table_name} value={table.table_name}>
                      {table.table_name}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </div>
          {selectedTable && availableColumns.length > 0 ? (
            <>
              <div>
                <Row>
                  <Col span={6}>
                    <p>Columns in the table</p>
                  </Col>
                  <Col span={6}>
                    <p>Display name</p>
                  </Col>
                </Row>
                {availableColumns.map((col, index) => (
                  <Row key={index} style={{ marginBottom: "10px" }}>
                    <Col span={6}>
                      <Checkbox
                        checked={
                          selectedColumns[col.column_name]?.selected || false
                        }
                        onChange={() => handleCheckboxChange(col.column_name)}
                      >
                        {col.column_name}
                      </Checkbox>
                    </Col>
                    <Col span={6}>
                      <Input
                        placeholder={col.column_name || ""}
                        value={selectedColumns[col.column_name]?.text || ""}
                        onChange={(e) =>
                          handleColumnInputChange(
                            col.column_name,
                            e.target.value
                          )
                        }
                        disabled={!selectedColumns[col.column_name]?.selected}
                      />
                    </Col>
                  </Row>
                ))}
              </div>
              <Divider />
              <div>
                <p>Apply filter</p>
                {filterList.map((item, groupIndex) => (
                  <div
                    key={groupIndex}
                    style={{
                      border: "1px solid #D3D3D3",
                      padding: 8,
                      marginBottom: 16,
                    }}
                  >
                    {item.filter_group.map(
                      (filter: any, filterIndex: number) => (
                        <div key={filterIndex}>
                          {filter.condition ? (
                            <Row
                              gutter={16}
                              style={{
                                marginTop: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              <Col span={4}>
                                <Select
                                  placeholder="Choose condition"
                                  style={{ width: "100%" }}
                                  value={filter.condition}
                                  onChange={(val) =>
                                    handleFilterFieldChange(
                                      groupIndex,
                                      filterIndex,
                                      "condition",
                                      val
                                    )
                                  }
                                >
                                  <Option value="AND">AND</Option>
                                  <Option value="OR">OR</Option>
                                </Select>
                              </Col>
                            </Row>
                          ) : null}
                          <Row gutter={16} style={{ marginBottom: 6 }}>
                            <Col span={6}>
                              <Select
                                placeholder="Choose column"
                                style={{ width: "100%" }}
                                value={filter.column}
                                onChange={(val) =>
                                  handleFilterFieldChange(
                                    groupIndex,
                                    filterIndex,
                                    "column",
                                    val
                                  )
                                }
                              >
                                {availableColumns.map((col) => (
                                  <Option
                                    key={col.column_name}
                                    value={col.column_name}
                                  >
                                    {col.column_name}
                                  </Option>
                                ))}
                              </Select>
                            </Col>
                            <Col span={6}>
                              <Select
                                placeholder="Filter type"
                                style={{ width: "100%" }}
                                value={filter.type}
                                onChange={(val) =>
                                  handleFilterFieldChange(
                                    groupIndex,
                                    filterIndex,
                                    "type",
                                    val
                                  )
                                }
                              >
                                {validateOperator.map((op) => (
                                  <Option key={op} value={op}>
                                    {op}
                                  </Option>
                                ))}
                              </Select>
                            </Col>
                            <Col span={6}>
                              <Input
                                placeholder="Filter value"
                                style={{ width: "100%" }}
                                value={filter.value}
                                onChange={(e) =>
                                  handleFilterFieldChange(
                                    groupIndex,
                                    filterIndex,
                                    "value",
                                    e.target.value
                                  )
                                }
                              />
                            </Col>
                            <Button
                              danger
                              onClick={() =>
                                handleRemoveFilter(groupIndex, filterIndex)
                              }
                            >
                              <DeleteFilled />
                            </Button>
                          </Row>
                        </div>
                      )
                    )}
                    <Button
                      type="link"
                      icon={<PlusSquareFilled />}
                      onClick={() => handleAddCondition(groupIndex)}
                    >
                      Add another condition
                    </Button>
                    <Button
                      type="link"
                      icon={<PlusSquareFilled />}
                      onClick={() => handleRemoveFilterGroup(groupIndex)}
                      danger
                    >
                      Delete the group
                    </Button>
                  </div>
                ))}
                <Button
                  type="dashed"
                  icon={<PlusCircleFilled />}
                  onClick={handleAddFilterGroup}
                >
                  Add filter group
                </Button>
              </div>
              <Divider />
              <div>
                <p>Apply sort</p>
                {sortList.map((sort, index) => (
                  <Row gutter={16} key={index} style={{ marginBottom: 8 }}>
                    <Col span={6}>
                      <Select
                        placeholder="Choose column"
                        style={{ width: "100%" }}
                        value={sort.column}
                        onChange={(val) =>
                          handleSortChange(val, index, "column")
                        }
                      >
                        {availableColumns.map((col) => (
                          <Option key={col.column_name} value={col.column_name}>
                            {col.column_name}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={6}>
                      <Select
                        placeholder="Sort type"
                        style={{ width: "100%" }}
                        value={sort.mode}
                        onChange={(val) => handleSortChange(val, index, "mode")}
                      >
                        <Option value="asc">Ascending</Option>
                        <Option value="desc">Descending</Option>
                      </Select>
                    </Col>
                    <Button danger onClick={() => handleRemoveSort(index)}>
                      <DeleteFilled />
                    </Button>
                  </Row>
                ))}
                <Button
                  type="dashed"
                  icon={<PlusCircleFilled />}
                  onClick={handleAddSort}
                >
                  Add sort
                </Button>
              </div>
            </>
          ) : null}
        </div>
      )}
    </Modal>
  );
}

export default EmailTableModel;
