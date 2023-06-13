import React from "react";
import { Table } from "antd";
import styled from "styled-components";

const TableA = styled(Table)`
  background-color: yellow;
  & th {
    color: white !important;
    background-color: #2f54eb !important;
  }
`;

const LocationTable: React.FC = () => {
  const locationLabel = [
    "State ID",
    "State",
    "District ID",
    "District",
    "Block ID",
    "Block",
  ];
  const columns = locationLabel.map((label: string) => {
    return {
      title: label,
      dataIndex: label.toLocaleLowerCase(),
      key: label.toLocaleLowerCase(),
    };
  });

  // Mock data for table
  const data: any = [];
  for (let i = 10001; i < 10007; i++) {
    data.push({
      key: i,
      "state id": i,
      state: "Bihar",
      "district id": i + 10000,
      district: "Katihar",
      "block id": i + 10000 + 10000,
      block: "Sameli",
    });
  }

  return (
    <TableA
      columns={columns}
      dataSource={data}
      pagination={false}
      style={{ marginRight: "80px", marginTop: "18px" }}
    />
  );
};

export default LocationTable;
