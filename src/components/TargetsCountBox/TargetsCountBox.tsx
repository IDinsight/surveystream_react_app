import { CheckCircleFilled } from "@ant-design/icons";

interface TargetCountProps {
  targetCount: number;
}

function TargetsCountBox({ targetCount }: TargetCountProps) {
  return (
    <div style={{ display: "flex", gap: 16, marginLeft: 28 }}>
      {targetCount ? (
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
            Total Targets: {targetCount}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default TargetsCountBox;
