import React, { useState } from "react";
import { Button, Table } from "antd";
import styled from "styled-components";
import { CloudDownloadOutlined } from "@ant-design/icons";
import { useCSVDownloader } from "react-papaparse";

const TableA = styled(Table)`
  margin-bottom: 80px;
  & th {
    color: white !important;
    background-color: #2f54eb !important;
    height: 40px;
    font-family: "Lato", sans-serif;
  }
  & td {
    height: 30px;
    font-family: "Lato", sans-serif;
  }
`;

interface LocationTableProps {
  columns: any[];
  data: any[];
}

const LocationTable: React.FC<LocationTableProps> = ({ columns, data }) => {
  const { CSVDownloader, Type } = useCSVDownloader();
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);

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
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginRight: "80px",
        }}
      >
        <p>Locations</p>
        <CSVDownloader
          data={transformedData}
          filename={"locations.csv"}
          style={{
            fontFamily: "Lato",
            cursor: "pointer",
            backgroundColor: "#2F54EB",
            color: "#FFF",
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
          }}
        >
          <CloudDownloadOutlined style={{ marginRight: "8px" }} />
          Download CSV
        </CSVDownloader>
      </div>
      <TableA
        columns={transformedColumns}
        dataSource={transformedData}
        pagination={{
          pageSize: paginationPageSize,
          pageSizeOptions: [25, 50, 100],
          showSizeChanger: true,
          showQuickJumper: true,
          onShowSizeChange: (_, size) => setPaginationPageSize(size),
        }}
        style={{ marginRight: "80px", marginTop: "18px" }}
      />
    </>
  );
};

export default LocationTable;
