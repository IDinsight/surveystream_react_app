import { Col, Row, Select, Tag, DatePicker, Input, Button } from "antd";
import {
  DeleteFilled,
  MinusSquareFilled,
  PlusCircleFilled,
  PlusSquareFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

interface IDQCheckFilterProps {
  filters: any[];
  setFilterList: any;
  questions: any[];
}

function DQChecksFilter({
  filters,
  setFilterList,
  questions,
}: IDQCheckFilterProps) {
  const validateOperator: any[] = [
    "Is",
    "Is not",
    "Contains",
    "Does not contain",
    "Is empty",
    "Is not empty",
    "Greater than",
    "Smaller than",
  ];

  const handleFilterFieldChange = (
    groupIndex: number,
    filterIndex: number,
    field: string,
    value: any
  ) => {
    setFilterList((prev: any) =>
      prev.map((group: any, i: number) =>
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

    // if filter operator is changed to "Is empty" or "Is not empty", clear the filter value
    if (
      field === "filter_operator" &&
      (value === "Is empty" || value === "Is not empty")
    ) {
      setFilterList((prev: any) =>
        prev.map((group: any, i: number) =>
          i === groupIndex
            ? {
                ...group,
                filter_group: group.filter_group.map((filter: any, j: any) =>
                  j === filterIndex ? { ...filter, filter_value: null } : filter
                ),
              }
            : group
        )
      );
    }
  };

  const handleRemoveFilter = (groupIndex: number, filterIndex: number) => {
    setFilterList((prev: any) =>
      prev
        .map((group: any, i: number) => {
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
        .filter((group: any) => group !== null)
    );
  };

  const handleAddCondition = (groupIndex: number) => {
    setFilterList((prev: any) => {
      const newFilters = [...prev];
      newFilters[groupIndex].filter_group.push({
        question_name: null,
        filter_operator: null,
        filter_value: null,
      });
      return newFilters;
    });
  };

  const handleRemoveFilterGroup = (groupIndex: number) => {
    setFilterList((prev: any) =>
      prev.filter((_: any, index: number) => index !== groupIndex)
    );
  };

  const handleAddFilterGroup = () => {
    setFilterList((prev: any) => [
      ...prev,
      {
        filter_group: [
          {
            question_name: null,
            filter_operator: null,
            filter_value: null,
          },
        ],
      },
    ]);
  };

  return (
    <>
      {filters.map((item: any, groupIndex: number) => (
        <>
          {groupIndex !== 0 && groupIndex !== filters.length ? (
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
            {item.filter_group.map((filter: any, filterIndex: number) => (
              <div key={filterIndex}>
                {filterIndex !== 0 &&
                filterIndex !== item.filter_group.length ? (
                  <Row
                    gutter={16}
                    justify="center"
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
                      placeholder="Choose question"
                      style={{ width: "100%" }}
                      value={filter.question_name}
                      onChange={(val) =>
                        handleFilterFieldChange(
                          groupIndex,
                          filterIndex,
                          "question_name",
                          val
                        )
                      }
                    >
                      {questions.map((col: any, i: number) => (
                        <Option key={`${i}-${col.name}`} value={col.name}>
                          {col.label}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Select
                      placeholder="Filter type"
                      style={{ width: "100%" }}
                      value={filter.filter_operator}
                      onChange={(val) =>
                        handleFilterFieldChange(
                          groupIndex,
                          filterIndex,
                          "filter_operator",
                          val
                        )
                      }
                    >
                      {
                        // If the question is select_multiple, we need to show only Contains and Does not contain
                        filter.question_name &&
                        questions.find(
                          (q: any) => q.name === filter.question_name
                        )?.is_multi_select
                          ? ["Contains", "Does not contain"].map((op) => (
                              <Option key={op} value={op}>
                                {op}
                              </Option>
                            ))
                          : validateOperator.map((op: any) => (
                              <Option key={op} value={op}>
                                {op}
                              </Option>
                            ))
                      }
                    </Select>
                  </Col>
                  <Col span={6}>
                    {filter.filter_operator === "Date: In Date Range" ? (
                      <DatePicker.RangePicker
                        style={{ width: "100%" }}
                        value={
                          filter.filter_value
                            ? filter.filter_value
                                .split(",")
                                .map((d: string) => dayjs(d))
                            : null
                        }
                        onChange={(dates: any, dateStrings: any) =>
                          handleFilterFieldChange(
                            groupIndex,
                            filterIndex,
                            "filter_value",
                            dateStrings.join(",")
                          )
                        }
                      />
                    ) : (
                      <Input
                        placeholder="Filter value"
                        style={{ width: "100%" }}
                        value={filter.filter_value}
                        disabled={
                          filter.filter_operator === "Is empty" ||
                          filter.filter_operator === "Is not empty"
                        }
                        onChange={(e: any) =>
                          handleFilterFieldChange(
                            groupIndex,
                            filterIndex,
                            "filter_value",
                            e.target.value
                          )
                        }
                      />
                    )}
                  </Col>
                  <Button
                    danger
                    onClick={() => handleRemoveFilter(groupIndex, filterIndex)}
                  >
                    <DeleteFilled />
                  </Button>
                </Row>
              </div>
            ))}
            <Button
              type="link"
              icon={<PlusSquareFilled />}
              onClick={() => handleAddCondition(groupIndex)}
            >
              Add another condition
            </Button>
            <Button
              type="link"
              icon={<MinusSquareFilled />}
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
        style={{ marginBottom: 16 }}
        icon={<PlusCircleFilled />}
        onClick={handleAddFilterGroup}
      >
        Add filter group
      </Button>
    </>
  );
}

export default DQChecksFilter;
