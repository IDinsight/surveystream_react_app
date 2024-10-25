import { Table, Tag, Button, Row, Col } from "antd";
import React, { useState, Key } from "react";

import { ColumnType } from "antd/es/table";

interface EnumeratorStatus {
  enumerator_id: string;
  enumerator_name: string;
  enumerator_email: string;
  status: string;
  error_message: string;
  supervisor_name: string;
  supervisor_email: string;
}

const columns: ColumnType<EnumeratorStatus>[] = [
  {
    title: "Enumerator ID",
    dataIndex: "enumerator_id",
    key: "enumerator_id",
    sorter: (a, b) => a.enumerator_id.localeCompare(b.enumerator_id),
  },
  {
    title: "Enumerator Name",
    dataIndex: "enumerator_name",
    key: "enumerator_name",
    sorter: (a, b) => a.enumerator_name.localeCompare(b.enumerator_name),
  },
  {
    title: "Enumerator Email",
    dataIndex: "enumerator_email",
    key: "enumerator_email",
    sorter: (a, b) => a.enumerator_email.localeCompare(b.enumerator_email),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    filters: [
      { text: "Sent", value: "sent" },
      { text: "Failed", value: "failed" },
    ],
    onFilter: (value: boolean | Key, record: EnumeratorStatus) =>
      typeof value === "boolean"
        ? false
        : record.status.includes(value.toString()),
    sorter: (a, b) => a.status.localeCompare(b.status),
    render: (status: string) => {
      let color = "green";
      if (status === "failed") {
        color = "red";
      }
      return (
        <Tag color={color} key={status}>
          {status.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    title: "Error",
    dataIndex: "error_message",
    key: "error_message",
    sorter: (a, b) => a.error_message.localeCompare(b.error_message),
  },
  {
    title: "Supervisor Name",
    dataIndex: "supervisor_name",
    key: "supervisor_name",
    sorter: (a, b) => a.supervisor_name.localeCompare(b.supervisor_name),
  },
  {
    title: "Supervisor Email",
    dataIndex: "supervisor_email",
    key: "supervisor_email",
    sorter: (a, b) => a.supervisor_email.localeCompare(b.supervisor_email),
  },
];

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString();
};

const combineSlotDateTime = (slot_date: string, slot_time: string) => {
  const cleanedSlotDate = new Date(slot_date).toDateString();
  const combinedDateTime = new Date(
    `${cleanedSlotDate} ${slot_time}`
  ).toLocaleString();
  return isNaN(new Date(combinedDateTime).getTime())
    ? "Invalid Date"
    : combinedDateTime;
};

function EmailDeliveryReport({
  deliveryReportData,
  slot_type,
}: {
  deliveryReportData: any;
  slot_type: string;
}) {
  const [selectedReportUID, setSelectedReportUID] = useState<null | string>(
    deliveryReportData[0].email_delivery_report_uid
  );
  const [tableKey, setTableKey] = useState<number>(0);

  const resetTable = () => {
    setTableKey((prevKey) => prevKey + 1);
  };
  return (
    <div style={{ fontFamily: "Lato" }}>
      <h2> Email Delivery Report</h2>

      {slot_type === "trigger" ? (
        <Row style={{ marginTop: "30px", display: "flex", float: "left" }}>
          <span style={{ display: "flex", float: "left", fontSize: "14px" }}>
            Delivery Time: {"   "} {"\t"}
            <select
              onChange={(e) => {
                setSelectedReportUID(e.target.value);
              }}
              style={{ marginLeft: "10px", fontSize: "14px" }}
            >
              {deliveryReportData.map((report: any, index: number) => (
                <option
                  key={report.email_delivery_report_uid}
                  value={report.email_delivery_report_uid}
                >
                  {formatDateTime(report.delivery_time)}
                </option>
              ))}
            </select>
          </span>
        </Row>
      ) : (
        <Row
          style={{ display: "flex", alignItems: "center", marginTop: "30px" }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
              marginRight: "20px",
            }}
          >
            Schedule Time: {"   "} {"\t"}
            <select
              onChange={(e) => {
                setSelectedReportUID(e.target.value);
              }}
              style={{ marginLeft: "10px", fontSize: "14px" }}
            >
              {deliveryReportData.map((report: any, index: number) => (
                <option
                  key={report.email_delivery_report_uid}
                  value={report.email_delivery_report_uid}
                >
                  {combineSlotDateTime(report.slot_date, report.slot_time)}
                </option>
              ))}
            </select>
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
            }}
          >
            Delivery Time:{" "}
            {formatDateTime(
              deliveryReportData.find(
                (report: any) =>
                  report.email_delivery_report_uid == selectedReportUID
              )?.delivery_time
            )}
          </span>
        </Row>
      )}
      {selectedReportUID && (
        <>
          <Row
            style={{
              fontSize: "14px",
              marginTop: "10px",
            }}
          >
            <Col span={8}>
              <Tag
                color="green"
                style={{
                  fontSize: "14px",
                  marginTop: "10px",
                }}
              >
                Total Enumerators with emails Sent:{" "}
                {
                  deliveryReportData
                    .find(
                      (report: any) =>
                        report.email_delivery_report_uid == selectedReportUID
                    )
                    ?.enumerator_status.filter(
                      (status: EnumeratorStatus) => status.status === "sent"
                    ).length
                }
              </Tag>
            </Col>
            <Col span={8}>
              <Tag
                color="red"
                style={{
                  marginLeft: "10px",
                  fontSize: "14px",
                  marginTop: "10px",
                }}
              >
                Total Enumerators with emails Failed:{" "}
                {
                  deliveryReportData
                    .find(
                      (report: any) =>
                        report.email_delivery_report_uid == selectedReportUID
                    )
                    ?.enumerator_status.filter(
                      (status: EnumeratorStatus) => status.status === "failed"
                    ).length
                }
              </Tag>
            </Col>
            <Col span={4} offset={4}>
              <Button onClick={resetTable} style={{ fontSize: "14px" }}>
                Clear Sort and Filters
              </Button>
            </Col>
          </Row>
          <span style={{ width: "100%" }}>
            <Table
              key={tableKey}
              columns={columns}
              dataSource={
                deliveryReportData.find(
                  (report: any) =>
                    report.email_delivery_report_uid == selectedReportUID
                )?.enumerator_status
              }
              rowKey="enumerator_id"
              style={{ width: "100%", marginTop: "40px" }}
            />
          </span>
        </>
      )}
    </div>
  );
}
export default EmailDeliveryReport;
