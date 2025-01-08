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
} from "antd";
import { useEffect, useState } from "react";
import FullScreenLoader from "../Loaders/FullScreenLoader";

const { Option } = Select;

interface DynamicTargetFilterProps {
  open: boolean;
  setOpen: any;
  columnList: any[];
  inputFilterList: any;
  setInputFilterList: any;
}

function DynamicTargetFilter({
  open,
  setOpen,
  columnList,
  inputFilterList,
  setInputFilterList,
}: DynamicTargetFilterProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const [filterList, setFilterList] = useState<any[]>([]);

  const validateOperator = [
    "Is",
    "Is not",
    "Contains",
    "Does not contain",
    "Is empty",
    "Is not empty",
  ];
  const [availableColumns, setAvailableColumns] = useState<any[]>([]);

  const handleAddFilterGroup = () => {
    setFilterList((prev) => [
      ...prev,
      {
        filter_group: [
          {
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
    // 1. Check if all filters in filter groups are valid
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
        variable_name: filter.column,
        filter_operator: filter.type,
        filter_value: filter.value,
      })),
    }));

    setInputFilterList(filter_list);

    // Reset the form on successful submission
    setFilterList([]);
    setOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    if (inputFilterList && inputFilterList.length > 0) {
      const transformedFilterList = inputFilterList.map((group: any) => ({
        filter_group: group.filter_group.map((filter: any) => ({
          column: filter.variable_name,
          type: filter.filter_operator,
          value: filter.filter_value,
        })),
      }));
      setFilterList(transformedFilterList);
    }

    setAvailableColumns(columnList);
    setLoading(false);
  }, [inputFilterList, columnList]);

  return (
    <Modal
      width="100%"
      open={open}
      title="Add Target Filter"
      onCancel={() => {
        setInputFilterList(inputFilterList);
        setOpen(false);
      }}
      onOk={handleSubmit}
      okText="Save"
    >
      {loading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ maxHeight: "450px", overflowY: "auto" }}>
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
                                showSearch
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
                                  <Option key={col} value={col}>
                                    {col}
                                  </Option>
                                ))}
                              </Select>
                            </Col>
                            <Col span={6}>
                              <Select
                                showSearch
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
        </div>
      )}
    </Modal>
  );
}

export default DynamicTargetFilter;
