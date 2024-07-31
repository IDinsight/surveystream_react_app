import { Button } from "antd";
import { Link } from "react-router-dom";

interface TableCardProps {
  title: string;
  description: string;
  btnLabel: string;
}

function TableCard({ title, description, btnLabel }: TableCardProps) {
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
          fontFamily: '"Lato", sans-serif',
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "#BFBFBF",
          fontFamily: '"Lato", sans-serif',
        }}
      >
        {description}
      </p>
      <Link to={`?table=${title.toLowerCase().replaceAll(" ", "_")}`}>
        <Button
          type="primary"
          style={{
            marginTop: 8,
            borderRadius: 2,
            backgroundColor: "#597EF7",
            color: "white",
            fontFamily: '"Lato", sans-serif',
          }}
        >
          {btnLabel}
        </Button>
      </Link>
    </div>
  );
}

export default TableCard;
