import React, { useState } from "react";
import { Table, Button, Select, Tag } from "antd";

const { Option } = Select;

const SurveyorMapping = () => {
  // Table data for Mapped Pairs
  const mappedPairsData = [
    {
      key: 1,
      surveyorLocation: "Telangana",
      surveyorCount: 500,
      supervisorLocation: "Telangana",
      supervisorCount: 1,
      status: "Complete",
    },
    {
      key: 2,
      surveyorLocation: "Maharashtra",
      surveyorCount: 129,
      supervisorLocation: "Maharashtra",
      supervisorCount: 1,
      status: "Complete",
    },
    {
      key: 3,
      surveyorLocation: "Bihar",
      surveyorCount: 390,
      supervisorLocation: "Bihar",
      supervisorCount: 1,
      status: "Complete",
    },
    {
      key: 4,
      surveyorLocation: "Punjab",
      surveyorCount: 209,
      supervisorLocation: "Punjab",
      supervisorCount: 1,
      status: "Complete",
    },
    {
      key: 5,
      surveyorLocation: "Jharkhand",
      surveyorCount: 230,
      supervisorLocation: "Jharkhand",
      supervisorCount: 2,
      status: "Pending",
    },
  ];

  // Table data for Unmapped Locations
  const unmappedData = [
    {
      key: 1,
      surveyorLocation: "Kerala",
      surveyorCount: 100,
      supervisorLocation: null,
      supervisorCount: 1,
    },
    {
      key: 2,
      surveyorLocation: "Karnataka",
      surveyorCount: 140,
      supervisorLocation: null,
      supervisorCount: 1,
    },
  ];

  // Columns for Mapped Pairs Table
  const mappedPairsColumns = [
    {
      title: "Surveyor Location",
      dataIndex: "surveyorLocation",
      key: "surveyorLocation",
    },
    {
      title: "Surveyor Count",
      dataIndex: "surveyorCount",
      key: "surveyorCount",
    },
    {
      title: "Supervisor Location",
      dataIndex: "supervisorLocation",
      key: "supervisorLocation",
    },
    {
      title: "Supervisor Count",
      dataIndex: "supervisorCount",
      key: "supervisorCount",
    },
    {
      title: "Mapping Status",
      dataIndex: "status",
      key: "status",
      render: (status: any) => (
        <Tag color={status === "Complete" ? "green" : "red"}>{status}</Tag>
      ),
    },
  ];

  // Columns for Unmapped Pairs Table
  const unmappedColumns = [
    {
      title: "Surveyor Location",
      dataIndex: "surveyorLocation",
      key: "surveyorLocation",
    },
    {
      title: "Surveyor Count",
      dataIndex: "surveyorCount",
      key: "surveyorCount",
    },
    {
      title: "Supervisor Location",
      dataIndex: "supervisorLocation",
      key: "supervisorLocation",
      render: (_: any, record: any) => (
        <Select
          style={{ width: 200 }}
          placeholder="Select Location"
          onChange={(value) => handleLocationChange(value, record.key)}
        >
          <Option value="Maharashtra">Maharashtra</Option>
          <Option value="Karnataka">Karnataka</Option>
          <Option value="Kerala">Kerala</Option>
        </Select>
      ),
    },
    {
      title: "Supervisor Count",
      dataIndex: "supervisorCount",
      key: "supervisorCount",
    },
    {
      title: "Mapping Status",
      dataIndex: "mappingStatus",
      key: "mappingStatus",
      render: () => <Tag color="red">Pending</Tag>,
    },
  ];

  const handleLocationChange = (value: any, key: any) => {
    console.log(`Supervisor Location changed for row ${key}: ${value}`);
  };

  return (
    <div>
      <p style={{ fontWeight: "bold" }}>Mapped Pairs:</p>
      <Table
        columns={mappedPairsColumns}
        dataSource={mappedPairsData}
        pagination={false}
      />
      <p style={{ marginTop: "36px", fontWeight: "bold" }}>
        There is no mapping available for below listed Surveyor locations,
        please map them manually:
      </p>
      <Table
        columns={unmappedColumns}
        dataSource={unmappedData}
        pagination={false}
      />
      <div style={{ marginTop: "20px" }}>
        <Button type="primary" style={{ marginRight: "10px" }}>
          Save
        </Button>
        <Button>Continue</Button>
        <Button style={{ marginLeft: "10px" }}>Cancel</Button>
      </div>
    </div>
  );
};

export default SurveyorMapping;
