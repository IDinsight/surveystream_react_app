import { Button, Col, Row } from "antd";
import TextArea from "antd/es/input/TextArea";

interface EmailScheduleFilterCardProps {
  tableList: any;
  handleEditTable: any;
}

const EmailScheduleFilterCard = ({
  tableList,
  handleEditTable,
}: EmailScheduleFilterCardProps) => {
  return (
    <>
      {tableList.map((table: any, index: number) => (
        <div
          key={index}
          style={{
            border: "1px solid #d9d9d9",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "8px",
          }}
        >
          <Row style={{ alignItems: "center" }}>
            <Col span={12}>
              <p style={{ fontWeight: "bold" }}>{table.table_name}</p>
            </Col>
            <Col span={6}>
              <p style={{ fontWeight: "bold" }}>
                Schedule filter groups: {table.filter_list?.length || "None"}
              </p>
            </Col>
            <Col style={{ textAlign: "right" }} span={6}>
              <Button type="link" onClick={() => handleEditTable(index)}>
                Edit Filters
              </Button>
            </Col>
          </Row>
        </div>
      ))}
    </>
  );
};

export default EmailScheduleFilterCard;
