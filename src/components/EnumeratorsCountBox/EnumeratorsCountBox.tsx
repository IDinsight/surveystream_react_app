import {
  CheckCircleFilled,
  CloseCircleFilled,
  InsertRowAboveOutlined,
  WarningFilled,
} from "@ant-design/icons";
import {
  EnumeratorsCountBoxContainer,
  RowCountValue,
  RowTitle,
} from "./EnumeratorsCountBox.styled";
import { Divider } from "antd";

function EnumeratorsCountBox() {
  return (
    <EnumeratorsCountBoxContainer>
      <div style={{ color: "#389E0D" }}>
        <RowTitle style={{ color: "#389E0D" }}>Active</RowTitle>
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
        <RowTitle style={{ color: "#CF1322" }}>Dropped-out</RowTitle>
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
        <RowTitle style={{ color: "#FA8C16" }}>Inactive</RowTitle>
        <div style={{ display: "flex", alignItems: "center" }}>
          <WarningFilled style={{ fontSize: 24 }} />
          <RowCountValue style={{ color: "#FA8C16" }}>0</RowCountValue>
        </div>
      </div>
    </EnumeratorsCountBoxContainer>
  );
}

export default EnumeratorsCountBox;
