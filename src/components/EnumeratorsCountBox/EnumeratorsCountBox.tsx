import {
  CheckCircleFilled,
  CloseCircleFilled,
  WarningFilled,
} from "@ant-design/icons";
import {
  EnumeratorsCountBoxContainer,
  RowCountDivider,
  RowCountValue,
  RowIconContainer,
  RowTitle,
} from "./EnumeratorsCountBox.styled";

interface ICountBox {
  color: string;
  title: string;
  count: number;
  Icon: React.FC<any>;
}

interface ERowCountBox {
  active: number;
  dropped: number;
  inactive: number;
}

function EnumeratorsCountBox({ active, dropped, inactive }: ERowCountBox) {
  return (
    <div style={{ display: "flex", gap: 16, marginLeft: 28 }}>
      {active ? (
        <div
          style={{
            backgroundColor: "#F6FFED",
            padding: "4px 12px",
            display: "flex",
            alignItems: "center",
            height: 30,
            borderRadius: 24,
          }}
        >
          <CheckCircleFilled style={{ fontSize: 16, color: "#389E0D" }} />
          <p
            style={{
              marginLeft: 8,
              fontFamily: "Lato",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {active} Active
          </p>
        </div>
      ) : null}
      {dropped ? (
        <div
          style={{
            backgroundColor: "rgb(255, 241, 240)",
            padding: "4px 12px",
            display: "flex",
            alignItems: "center",
            height: 30,
            borderRadius: 24,
          }}
        >
          <CloseCircleFilled style={{ fontSize: 16, color: "#CF1312" }} />
          <p
            style={{
              marginLeft: 8,
              fontFamily: "Lato",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {dropped} Dropped
          </p>
        </div>
      ) : null}
      {inactive ? (
        <div
          style={{
            backgroundColor: "rgb(255, 247, 230)",
            padding: "4px 12px",
            display: "flex",
            alignItems: "center",
            height: 30,
            borderRadius: 24,
          }}
        >
          <WarningFilled style={{ fontSize: 16, color: "#FA8C16" }} />
          <p
            style={{
              marginLeft: 8,
              fontFamily: "Lato",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {inactive} Inactive
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default EnumeratorsCountBox;
