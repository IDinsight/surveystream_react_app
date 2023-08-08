import {
  CheckCircleFilled,
  CloseCircleFilled,
  InsertRowAboveOutlined,
  WarningFilled,
} from "@ant-design/icons";
import React from "react";
import {
  RowCountBoxContainer,
  RowCountValue,
  RowTitle,
} from "./RowCountBox.styled";
import { Divider } from "antd";

function RowCountBox() {
  return (
    <RowCountBoxContainer>
      <div>
        <RowTitle>Total rows found</RowTitle>
        <div style={{ display: "flex", alignItems: "center" }}>
          <InsertRowAboveOutlined style={{ fontSize: 24 }} />
          <RowCountValue>987</RowCountValue>
        </div>
      </div>
      <Divider
        type="vertical"
        style={{ height: 80, backgroundColor: "#F0F0F0" }}
      />
      <div style={{ color: "#389E0D" }}>
        <RowTitle style={{ color: "#389E0D" }}>Correct rows</RowTitle>
        <div style={{ display: "flex", alignItems: "center" }}>
          <CheckCircleFilled style={{ fontSize: 24 }} />
          <RowCountValue style={{ color: "#389E0D" }}>858</RowCountValue>
        </div>
      </div>
      <Divider
        type="vertical"
        style={{ height: 80, backgroundColor: "#F0F0F0" }}
      />
      <div style={{ color: "#CF1322" }}>
        <RowTitle style={{ color: "#CF1322" }}>Rows with errors</RowTitle>
        <div style={{ display: "flex", alignItems: "center" }}>
          <CloseCircleFilled style={{ fontSize: 24 }} />
          <RowCountValue style={{ color: "#CF1322" }}>62</RowCountValue>
        </div>
      </div>
      <Divider
        type="vertical"
        style={{ height: 80, backgroundColor: "#F0F0F0" }}
      />
      <div style={{ color: "#FA8C16" }}>
        <RowTitle style={{ color: "#FA8C16" }}>Rows with warnings</RowTitle>
        <div style={{ display: "flex", alignItems: "center" }}>
          <WarningFilled style={{ fontSize: 24 }} />
          <RowCountValue style={{ color: "#FA8C16" }}>0</RowCountValue>
        </div>
      </div>
    </RowCountBoxContainer>
  );
}

export default RowCountBox;
