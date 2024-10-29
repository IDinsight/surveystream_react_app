import { properCase } from "./../../utils/helper";

import { CheckCircleFilled, WarningFilled } from "@ant-design/icons";

interface IMappingStatsProps {
  stats: {
    type: string;
    mapped: number;
    unmapped: number;
  };
}
function MappingStats({ stats }: IMappingStatsProps) {
  const { type, mapped, unmapped } = stats;

  return (
    <div style={{ display: "flex", gap: 16, marginLeft: "auto" }}>
      {mapped !== null ? (
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
            {mapped} {type ? properCase(type) + "s" : ""} mapped
          </p>
        </div>
      ) : null}
      {unmapped !== null ? (
        <div
          style={{
            backgroundColor: "#FFF1F0",
            padding: "4px 12px",
            display: "flex",
            alignItems: "center",
            height: 30,
            borderRadius: 24,
          }}
        >
          <WarningFilled style={{ fontSize: 16, color: "#CF1322" }} />
          <p
            style={{
              marginLeft: 8,
              fontFamily: "Lato",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {unmapped} {type ? properCase(type) + "s" : ""} not mapped
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default MappingStats;
