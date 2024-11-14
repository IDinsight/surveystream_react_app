import { useState } from "react";
import { Button, Col, Form, Input, Radio, Row, Switch, Tag } from "antd";
import Container from "../../../components/Layout/Container";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { HeaderContainer, Title } from "../../../shared/Nav.styled";
import { BodyContainer, CustomBtn } from "./DQChecks.styled";
import DQChecksFilter from "./DQChecksFilter";

function DQChecksEdit() {
  const [mode, setMode] = useState<number>(1);
  const isLoading = false;

  const columns = [
    {
      title: "Variable name",
      dataIndex: "variableName",
      key: "variableName",
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

  const data = [
    {
      key: "1",
      variableName: "age",
      moduleName: "Basic Information",
      flagDescription: "-",
      constraint: "-",
      value: "NA, NULL, -99",
      status: "Inactive",
    },
    {
      key: "2",
      variableName: "consent",
      moduleName: "Basic Information",
      flagDescription: "-",
      constraint: "-",
      value: "NA, NULL, -99",
      status: "Active",
    },
    {
      key: "3",
      variableName: "p1_crop_*",
      moduleName: "Agriculture",
      flagDescription: "Crop cultivation in the plot",
      constraint: "p1_area_* > 0",
      value: "NA, NULL, -99, -777",
      status: "Active",
    },
    {
      key: "4",
      variableName: "p2_area_*",
      moduleName: "Agriculture",
      flagDescription: "Area of plot",
      constraint: "-",
      value: "NA, NULL, -99, -777",
      status: "Active",
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container />
          <HeaderContainer>
            <Title>Missing Values Checks</Title>
          </HeaderContainer>
          <BodyContainer>
            <p style={{ color: "#8C8C8C", fontSize: 14 }}>
              Checks that certain variables have no missing values. By default,
              the following are considered missing: ‘ ’, NA, NAN, NULL (case
              insensitive)
            </p>
            <Radio.Group
              value={mode}
              style={{ marginTop: 16, marginBottom: 16 }}
              onChange={(val) => setMode(val.target.value)}
            >
              <Radio value={1}>Apply check on all variables in the form</Radio>
              <Radio value={2}>Apply check on select variables</Radio>
            </Radio.Group>
            {mode === 1 && (
              <>
                <div style={{ marginTop: 16, marginBottom: 16 }}>
                  <Switch
                    defaultChecked
                    checkedChildren="ACTIVE"
                    unCheckedChildren="INACTIVE"
                  />
                </div>
                <Row>
                  <Col span={4}>
                    <Form.Item label="Value is missing if value is:" />
                  </Col>
                  <Col span={6}>
                    <Input placeholder="‘’, NA, NAN, NULL" />
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <Form.Item label="Flag description:" />
                  </Col>
                  <Col span={6}>
                    <Input placeholder="Input flag description" />
                  </Col>
                </Row>
                <div>
                  <Form.Item label="Filter data before applying this check:" />
                  <DQChecksFilter />
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
                      <Input placeholder="Input module name" />
                    </Col>
                  </Row>
                </div>
                <div>
                  <CustomBtn>Save</CustomBtn>
                  <Button style={{ marginLeft: 32 }}>Cancel</Button>
                </div>
              </>
            )}
            {mode === 2 && (
              <>
                <div style={{ display: "flex" }}>
                  <div style={{ marginTop: 16 }}>
                    <Tag
                      color="#F6FFED"
                      style={{ color: "#52C41A", borderColor: "#B7EB8F" }}
                    >
                      15 active checks
                    </Tag>
                    <Tag
                      color="#FFF7E6"
                      style={{ color: "#FA8C16", borderColor: "#FA8C16" }}
                    >
                      16 checks configured
                    </Tag>
                  </div>
                  <Button type="primary" style={{ marginLeft: "auto" }}>
                    Add
                  </Button>
                </div>
                <ChecksTable
                  style={{ marginTop: 16 }}
                  columns={columns}
                  dataSource={data}
                  pagination={{ pageSize: 5 }}
                  rowSelection={rowSelection}
                />
              </>
            )}
          </BodyContainer>
        </>
      )}
    </>
  );
}

export default DQChecksEdit;
