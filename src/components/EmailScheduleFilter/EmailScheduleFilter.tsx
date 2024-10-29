import {
  DeleteFilled,
  PlusCircleFilled,
  PlusSquareFilled,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Input,
  message,
  Modal,
  Row,
  Select,
  Tag,
  DatePicker,
} from "antd";
import { useEffect, useState } from "react";
import { getTableCatalogSchedule } from "../../redux/emails/apiService";
import FullScreenLoader from "../Loaders/FullScreenLoader";
import dayjs from "dayjs";

const { Option } = Select;

interface EmailScheduleFilterProps {
  open: boolean;
  setOpen: any;
  configUID: string;
  tableList: any[];
  setTableList: any;
  editingIndex: null | number;
  setEditingIndex: any;
}

function EmailScheduleFilter({
  open,
  setOpen,
  configUID,
  tableList,
  setTableList,
  editingIndex,
  setEditingIndex,
}: EmailScheduleFilterProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [tableCatelog, setTableCatelog] = useState<any[]>([]);
  const [availableColumns, setAvailableColumns] = useState<any[]>([]);

  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [filterList, setFilterList] = useState<any[]>([]);
  const validateOperator = [
    "Is",
    "Is not",
    "Contains",
    "Does not contain",
    "Is empty",
    "Is not empty",
    "Greater than",
    "Smaller than",
    "Date: Is Current Date",
    "Date: In last week",
    "Date: In last month",
    "Date: In Date Range",
  ];

  const handleAddFilterGroup = () => {
    setFilterList((prev) => [
      ...prev,
      {
        filter_group: [
          {
            table_name: selectedTable,
            column: null,
            type: null,
            value: null,
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
                { column: null, type: null, value: null },
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

  const handleSubmit = () => {
    // 1. Check if a table is selected
    if (!selectedTable) {
      message.error("Please select a table.");
      return;
    }

    // 2. Check if any filter group is added
    if (filterList.length === 0) {
      message.error("Please add a filter group.");
      return;
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

    const filter_list = filterList.map((group) => ({
      filter_group: group.filter_group.map((filter: any) => ({
        table_name: selectedTable,
        filter_variable: filter.column,
        filter_operator: filter.type,
        filter_value: filter.value,
      })),
    }));

    // Combine all parts into the final structure
    const result = {
      table_name: selectedTable,
      filter_list: filter_list,
    };

    setTableList(result);

    // Reset the form on successful submission
    setSelectedTable(null);
    setFilterList([]);
    setEditingIndex(null);
    setOpen(false);
  };

  // Getting the table catalog
  useEffect(() => {
    if (configUID) {
      setLoading(true);
      getTableCatalogSchedule(configUID)
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
      message.error("Config UID not found");
    }
  }, [configUID]);

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

      const filter_list = table.filter_list;
      const filterList = filter_list.map((group: any) => ({
        filter_group: group.filter_group.map((filter: any) => ({
          table_name: table.table_name,
          column: filter.filter_variable,
          type: filter.filter_operator,
          value: filter.filter_value,
        })),
      }));
      setFilterList(filterList);
    }
  }, [tableList, editingIndex]);

  return (
    <Modal
      width="100%"
      open={open}
      title="Add Schedule Filter"
      onCancel={() => {
        setSelectedTable(null);
        setFilterList([]);
        setOpen(false);
      }}
      onOk={handleSubmit}
      okText="Save"
    >
      {loading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ maxHeight: "450px", overflowY: "auto" }}>
          <div style={{ marginBottom: 16 }}>
            <p>Select tables to apply filters for schedules</p>
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
                <p>Apply filter</p>
                {filterList.map((item, groupIndex) => (
                  <>
                    {groupIndex !== 0 && groupIndex !== filterList.length ? (
                      <Row
                        gutter={16}
                        justify="center"
                        style={{
                          marginTop: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        <Col span={2}>
                          <Tag color="#108ee9">OR</Tag>
                        </Col>
                      </Row>
                    ) : null}
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
                            {filterIndex !== 0 &&
                            filterIndex !== item.filter_group.length ? (
                              <Row
                                gutter={16}
                                style={{
                                  marginTop: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                <Col span={2}>
                                  <Tag color="#87d068">AND</Tag>
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
                                {filter.type === "Date: In Date Range" ? (
                                  <DatePicker.RangePicker
                                    style={{ width: "100%" }}
                                    value={
                                      filter.value
                                        ? filter.value
                                            .split(",")
                                            .map((d: string) => dayjs(d))
                                        : null
                                    }
                                    onChange={(dates, dateStrings) =>
                                      handleFilterFieldChange(
                                        groupIndex,
                                        filterIndex,
                                        "value",
                                        dateStrings.join(",")
                                      )
                                    }
                                  />
                                ) : (
                                  <Input
                                    placeholder="Filter value"
                                    style={{ width: "100%" }}
                                    value={filter.value || ""}
                                    onChange={(e) =>
                                      handleFilterFieldChange(
                                        groupIndex,
                                        filterIndex,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                  />
                                )}
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
                  </>
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
            </>
          ) : null}
        </div>
      )}
    </Modal>
  );
}

export default EmailScheduleFilter;
