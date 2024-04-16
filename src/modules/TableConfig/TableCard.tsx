import { Button } from "antd";
import { Link, useLocation } from "react-router-dom";

interface TableCardProps {
  title: string;
  description: string;
  btnLabel: string;
}

function TableCard({ title, description, btnLabel }: TableCardProps) {
  const location = useLocation();
  return (
    <div
      style={{
        height: 140,
        width: 300,
        padding: 24,
        border: "1px solid #F0F0F0",
        marginRight: 24,
        marginTop: 24,
      }}
    >
      <p
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: "#434343",
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "#BFBFBF",
        }}
      >
        {description}
      </p>
      <Link to={`?table=${title.toLowerCase().replaceAll(" ", "_")}`}>
        <Button type="primary" style={{ marginTop: 8, borderRadius: 2 }}>
          {btnLabel}
        </Button>
      </Link>
    </div>
  );
}

export default TableCard;
