import { Tag, Button, Row, Col, message } from "antd";
import { useState, Key, useEffect } from "react";
import { StyledTable, StyledTag } from "./EmailDeliveryReport.styled";

import { ColumnType } from "antd/es/table";
import { ClearOutlined, ReloadOutlined } from "@ant-design/icons";
import { getEmailDeliveryReportEnumerator } from "../../redux/emails/apiService";

interface EnumeratorStatus {
  enumerator_id: string;
  enumerator_name: string;
  enumerator_email: string;
  status: string;
  error_message: string;
  supervisor_name: string;
  supervisor_email: string;
}

function EmailDeliveryReport({
  deliveryReportData,
  slot_type,
  email_config_uid,
}: {
  deliveryReportData: any;
  slot_type: string;
  email_config_uid?: string;
}) {
  const [selectedReportUID, setSelectedReportUID] = useState<null | string>(
    deliveryReportData[0].email_delivery_report_uid
  );
  const [tableKey, setTableKey] = useState<number>(0);
  const [enumeratorData, setEnumeratorData] = useState<EnumeratorStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const selectedReport = deliveryReportData.find(
    (report: any) => report.email_delivery_report_uid === selectedReportUID
  );

  // Function to fetch enumerator data for selected report
  const fetchEnumeratorData = async (reportUID: string) => {
    if (!reportUID) return;

    const configUID = email_config_uid || selectedReport?.email_config_uid;
    if (!configUID) return;

    setLoading(true);
    try {
      const response = await getEmailDeliveryReportEnumerator(
        configUID,
        reportUID
      );

      if ((response as any)?.data?.success) {
        const responseData = (response as any).data.data;
        // Find the matching delivery report and extract enumerator_status
        const matchingReport = responseData.find(
          (report: any) =>
            report.email_delivery_report_uid.toString() === reportUID
        );
        setEnumeratorData(matchingReport?.enumerator_status || []);
      } else {
        setEnumeratorData([]);
        message.error("Failed to fetch enumerator data");
      }
    } catch (error) {
      console.error("Error fetching enumerator data:", error);
      setEnumeratorData([]);
      message.error("Error occurred while fetching enumerator data");
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch enumerator data when selectedReportUID changes
  useEffect(() => {
    if (selectedReportUID) {
      fetchEnumeratorData(selectedReportUID);
    }
  }, [selectedReportUID, selectedReport]);

  const columns: ColumnType<EnumeratorStatus>[] = [
    {
      title: "Enumerator ID",
      dataIndex: "enumerator_id",
      key: "enumerator_id",
      sorter: (a, b) => a.enumerator_id.localeCompare(b.enumerator_id),
      filters: Array.from(
        new Set(
          enumeratorData.map(
            (status: EnumeratorStatus) => status.enumerator_id
          ) || []
        )
      ).map((id) => ({ text: String(id), value: String(id) })),
      onFilter: (value: boolean | Key, record: EnumeratorStatus) =>
        record.enumerator_id === value,
    },
    {
      title: "Enumerator Name",
      dataIndex: "enumerator_name",
      key: "enumerator_name",
      sorter: (a, b) => a.enumerator_name.localeCompare(b.enumerator_name),
      filters: Array.from(
        new Set(
          enumeratorData.map(
            (status: EnumeratorStatus) => status.enumerator_name
          ) || []
        )
      ).map((name) => ({ text: String(name), value: String(name) })),
      onFilter: (value: boolean | Key, record: EnumeratorStatus) =>
        record.enumerator_name === value,
    },
    {
      title: "Enumerator Email",
      dataIndex: "enumerator_email",
      key: "enumerator_email",
      sorter: (a, b) => a.enumerator_email.localeCompare(b.enumerator_email),
      filters: Array.from(
        new Set(
          enumeratorData.map(
            (status: EnumeratorStatus) => status.enumerator_email
          ) || []
        )
      ).map((email) => ({ text: String(email), value: String(email) })),
      onFilter: (value: boolean | Key, record: EnumeratorStatus) =>
        record.enumerator_email === value,
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
      filters: Array.from(
        new Set(
          enumeratorData.map(
            (status: EnumeratorStatus) => status.error_message || "No Error"
          ) || []
        )
      ).map((error) => ({ text: String(error), value: String(error) })),
      onFilter: (value: boolean | Key, record: EnumeratorStatus) =>
        (record.error_message || "No Error") === value,
      sorter: (a, b) =>
        (a.error_message || "").localeCompare(b.error_message || ""),
    },
    {
      title: "Supervisor Name",
      dataIndex: "supervisor_name",
      key: "supervisor_name",
      sorter: (a, b) => a.supervisor_name.localeCompare(b.supervisor_name),
      filters: Array.from(
        new Set(
          enumeratorData.map(
            (status: EnumeratorStatus) => status.supervisor_name
          ) || []
        )
      ).map((name) => ({ text: String(name), value: String(name) })),
      onFilter: (value: boolean | Key, record: EnumeratorStatus) =>
        record.supervisor_name === value,
    },
    {
      title: "Supervisor Email",
      dataIndex: "supervisor_email",
      key: "supervisor_email",
      sorter: (a, b) => a.supervisor_email.localeCompare(b.supervisor_email),
      filters: Array.from(
        new Set(
          enumeratorData.map(
            (status: EnumeratorStatus) => status.supervisor_email
          ) || []
        )
      ).map((email) => ({ text: String(email), value: String(email) })),
      onFilter: (value: boolean | Key, record: EnumeratorStatus) =>
        record.supervisor_email === value,
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
    return combinedDateTime;
  };

  const tableData = enumeratorData || [];

  const resetTable = () => {
    setTableKey((prevKey) => prevKey + 1);
  };
  return (
    <div style={{ fontFamily: "Lato", display: "grid" }}>
      <h2> Email Delivery Report</h2>

      {slot_type === "trigger" ? (
        <Row>
          <span style={{ display: "flex", float: "left", fontSize: "14px" }}>
            Delivery Time: {"   "} {"\t\t"}
            <select
              onChange={(e) => {
                setSelectedReportUID(e.target.value);
              }}
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
        <Row>
          <Col span={6}>
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
          </Col>
          <Col span={6}>
            Delivery Time: {"\t"}
            {formatDateTime(
              deliveryReportData.find(
                (report: any) =>
                  report.email_delivery_report_uid == selectedReportUID
              )?.delivery_time
            )}
          </Col>
        </Row>
      )}
      {selectedReportUID && (
        <>
          <Row style={{ marginTop: "20px", fontSize: "20px" }}>
            <Col span={8}>
              <StyledTag color="green">
                Emails Sent to Enumerators:{" "}
                {
                  enumeratorData.filter(
                    (status: EnumeratorStatus) => status.status === "sent"
                  ).length
                }
              </StyledTag>
            </Col>
            <Col span={8}>
              <StyledTag color="red">
                Emails Failed for Enumerators:{" "}
                {
                  enumeratorData.filter(
                    (status: EnumeratorStatus) => status.status === "failed"
                  ).length
                }
              </StyledTag>
            </Col>
            <Col span={1} offset={7}>
              <Button onClick={resetTable} icon={<ClearOutlined />} />
            </Col>
          </Row>
          <StyledTable
            key={tableKey}
            bordered={true}
            columns={columns as any}
            dataSource={tableData}
            rowKey="enumerator_id"
            style={{ width: "100%", marginTop: "40px" }}
            loading={loading}
          />
        </>
      )}
    </div>
  );
}
export default EmailDeliveryReport;
