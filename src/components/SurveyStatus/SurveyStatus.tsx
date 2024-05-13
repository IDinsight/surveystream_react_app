import { DownOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Modal, Space, message } from "antd";
import { useState } from "react";

function SurveyorStatus({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    if (status === "not_attempted") {
      return {
        label: "Not Attempted",
        style: {
          backgroundColor: "#FFF1F0",
          color: "#F5222D",
          border: "1px solid #FFA39E",
          padding: "2px 8px",
          width: "120px",
        },
      };
    } else if (status === "appointment") {
      return {
        label: "Appointment",
        style: {
          backgroundColor: "#E6F7FF",
          color: "#1890FF",
          border: "1px solid #91D5FF",
          padding: "2px 8px",
          width: "120px",
        },
      };
    } else if (status === "half_complete") {
      return {
        label: "Half complete",
        style: {
          backgroundColor: "#FFF0F6",
          color: "#EB2F96",
          border: "1px solid #FFADD2",
          padding: "2px 8px",
          width: "120px",
        },
      };
    } else if (status === "revisit") {
      return {
        label: "Revisit",
        style: {
          backgroundColor: "#F9F0FF",
          color: "#722ED1",
          border: "1px solid #D3ADF7",
        },
      };
    }
  };

  return (
    <p
      style={{
        ...getStatusConfig(status)?.style,
        padding: "2px 8px",
        width: "120px",
        margin: 0,
        textAlign: "center",
      }}
    >
      {getStatusConfig(status)?.label}
    </p>
  );
}

export default SurveyorStatus;
