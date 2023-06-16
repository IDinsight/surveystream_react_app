import React from "react";
import { Table } from "antd";
import styled from "styled-components";

const TableA = styled(Table)`
  margin-bottom: 80px;
  & th {
    color: white !important;
    background-color: #2f54eb !important;
    height: 40px;
  }
  & td {
    height: 30px;
  }
`;

interface LocationTableProps {
  columns: any[];
  data: any[];
}

const LocationTable: React.FC<LocationTableProps> = ({ columns, data }) => {
  const transformedColumns = columns.map((label: string) => {
    return {
      title: label,
      dataIndex: label.toLocaleLowerCase(),
      key: label.toLocaleLowerCase(),
    };
  });

  const transformedData = data.map((record: any, index: number) => {
    const transformedRecord: any = {};
    columns.forEach((column) => {
      transformedRecord[column.toLocaleLowerCase()] = record[column];
    });
    transformedRecord.key = index;
    return transformedRecord;
  });

  return (
    <TableA
      columns={transformedColumns}
      dataSource={transformedData}
      pagination={false}
      style={{ marginRight: "80px", marginTop: "18px" }}
    />
  );
};

export default LocationTable;
