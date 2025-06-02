import React, { useState } from "react";
import { Table } from "antd";
import styled from "styled-components";
import { TableRowSelection } from "antd/es/table/interface";

const LocationsTable = styled(Table)`
  margin-bottom: 68px;
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
  rowSelection: TableRowSelection<any>;
}

const LocationTable: React.FC<LocationTableProps> = ({
  transformedColumns,
  transformedData,
  rowSelection,
}) => {
  const [paginationPageSize, setPaginationPageSize] = useState<number>(10);

  return (
    <>
      <LocationsTable
        columns={transformedColumns}
        dataSource={transformedData}
        rowSelection={rowSelection}
        bordered={true}
        pagination={{
          position: ["topRight"],
          pageSize: paginationPageSize,
          pageSizeOptions: [5, 10, 25, 50, 100],
          showSizeChanger: true,
          showQuickJumper: true,
          onShowSizeChange: (_, size) => setPaginationPageSize(size),
          style: { color: "#2F54EB" },
        }}
      />
    </>
  );
};

export default LocationTable;
