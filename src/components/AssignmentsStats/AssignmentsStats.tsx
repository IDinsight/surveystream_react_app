import {
  CheckCircleFilled,
  ControlFilled,
  InfoCircleFilled,
} from "@ant-design/icons";

interface IAssignmentsStatusProps {
  stats: {
    completed?: number;
    assigned?: number;
    unassigned?: number;
  };
}
function AssignmentsStats({ stats }: IAssignmentsStatusProps) {
  const { completed, assigned, unassigned } = stats;
  return (
    <div style={{ display: "flex", gap: 16, marginLeft: 28 }}>
      {completed ? (
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
            {completed} Completed
          </p>
        </div>
      ) : null}
      {assigned ? (
        <div
          style={{
            backgroundColor: "#FFF7E6",
            padding: "4px 12px",
            display: "flex",
            alignItems: "center",
            height: 30,
            borderRadius: 24,
          }}
        >
          <ControlFilled style={{ fontSize: 16, color: "#D46B08" }} />
          <p
            style={{
              marginLeft: 8,
              fontFamily: "Lato",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {assigned} Assigned
          </p>
        </div>
      ) : null}
      {unassigned ? (
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
          <InfoCircleFilled style={{ fontSize: 16, color: "#CF1322" }} />
          <p
            style={{
              marginLeft: 8,
              fontFamily: "Lato",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {unassigned} Unassigned
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default AssignmentsStats;
