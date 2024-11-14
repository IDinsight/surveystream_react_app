import { Col, Row, Select, Tag, DatePicker, Input, Button } from "antd";
import { DeleteFilled, PlusSquareFilled } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

function DQChecksFilter() {
  const filterList: any[] = [
    {
      filter_group: [
        {
          table_name: "test_table",
          filter_variable: "test_column",
          filter_operator: "Is",
          filter_value: "test_value",
        },
        {
          table_name: "test_table",
          filter_variable: "test_column2",
          filter_operator: "Is",
          filter_value: "test_value2",
        },
      ],
    },
    {
      filter_group: [
        {
          table_name: "test_table",
          filter_variable: "test_column",
          filter_operator: "Is",
          filter_value: "test_value",
        },
        {
          table_name: "test_table",
          filter_variable: "test_column2",
          filter_operator: "Is not",
          filter_value: "test_value2",
        },
      ],
    },
  ];
  const availableColumns: any[] = [];
  const validateOperator: any[] = [];

  const handleFilterFieldChange = (
    groupIndex: number,
    filterIndex: number,
    field: string,
    value: any
  ) => {
    // Implement the function
  };

  const handleRemoveFilter = (groupIndex: number, filterIndex: number) => {
    // Implement the function
  };

  const handleAddCondition = (groupIndex: number) => {
    // Implement the function
  };

  const handleRemoveFilterGroup = (groupIndex: number) => {
    // Implement the function
  };

  return (
    <>
      {filterList.map((item: any, groupIndex: number) => (
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
                      {availableColumns.map((col: any) => (
                        <Option key={col.column_name} value={col.column_name}>
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
                      {validateOperator.map((op: any) => (
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
                        onChange={(dates: any, dateStrings: any) =>
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
                        value={filter.value}
                        onChange={(e: any) =>
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
              icon={<PlusSquareFilled />}
              onClick={() => handleRemoveFilterGroup(groupIndex)}
              danger
            >
              Delete the group
            </Button>
          </div>
        </>
      ))}
    </>
  );
}

export default DQChecksFilter;
