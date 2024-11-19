import React, { useState } from "react";
import { Table } from "antd";
import styled from "styled-components";

const LocationsTable = styled(Table)`
  margin-top: 15px;
  margin-bottom: 68px;
  margin-right: 30px;
  & th {
    color: #434343 !important;
    background-color: #d6e4ff !important;
    height: 40px;
    font-family: "Lato", sans-serif;
  }
  & th::before {
    background-color: #595959 !important;
  }
  & td {
    font-family: "Lato", sans-serif;
  }
`;

interface LocationTableProps {
  transformedColumns: { title: string; dataIndex: string; key: string }[];
  transformedData: { [key: string]: string | number | boolean }[];
}

const LocationTable: React.FC<LocationTableProps> = ({
  transformedColumns,
  transformedData,
}) => {
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);

  return (
    <>
      <LocationsTable
        columns={transformedColumns}
        tableLayout="auto"
        dataSource={transformedData}
        pagination={{
          pageSize: paginationPageSize,
          pageSizeOptions: [25, 50, 100],
          showSizeChanger: true,
          showQuickJumper: true,
          onShowSizeChange: (_, size) => setPaginationPageSize(size),
        }}
      />
    </>
  );
};

export default LocationTable;
