import { Row, Col } from "antd";

import { ErrorTable, WarningTable } from "./ErrorWarningTable.styled";
interface ErrorWarningTableProps {
  errorList?: any[];
  warningList?: any[];
  showErrorTable?: boolean;
  showWarningTable?: boolean;
}

export function ErrorWarningTable({
  errorList = [],
  warningList = [],
  showErrorTable = true,
  showWarningTable = true,
}: ErrorWarningTableProps) {
  // Use default columns if not provided
  const errorTableColumn = [
    {
      title: "Error type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Error Count",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Rows with error",
      dataIndex: "rows",
      key: "rows",
      render: (text: string, record: any) => record.rows || record.message,
    },
  ];

  const warningTableColumn = [
    {
      title: "Warning type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Warning Count",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Rows with warning",
      dataIndex: "rows",
      key: "rows",
      render: (text: string, record: any) => record.rows || record.message,
    },
  ];

  return (
    <>
      {showErrorTable && errorList.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <Row>
            <Col span={23}>
              <ErrorTable
                dataSource={errorList}
                columns={errorTableColumn}
                pagination={false}
              />
            </Col>
          </Row>
        </div>
      )}
      {showWarningTable && warningList.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <Row>
            <Col span={23}>
              <WarningTable
                dataSource={warningList}
                columns={warningTableColumn}
                pagination={false}
              />
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}

export default ErrorWarningTable;
