import { Button, Col, Row } from "antd";
import TextArea from "antd/es/input/TextArea";

interface EmailTableCardProps {
  tableList: any;
  handleEditTable: any;
  disableEdit: boolean;
}

const EmailTableCard = ({
  tableList,
  handleEditTable,
  disableEdit,
}: EmailTableCardProps) => {
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
              <p style={{ fontWeight: "bold", fontSize: "18px", marginTop: 0 }}>
                {table.variable_name}
              </p>
            </Col>
            <Col style={{ textAlign: "right" }} span={12}>
              <Button
                type="link"
                onClick={() => handleEditTable(index)}
                disabled={disableEdit}
              >
                Edit table
              </Button>
            </Col>
          </Row>
          <Row style={{ marginBottom: "4px" }}>
            <Col span={24}>
              <p style={{ fontWeight: "bold", margin: 0 }}>Selected table:</p>
              <p style={{ margin: 0 }}>{table.table_name}</p>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <p
                style={{
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                Selected columns:
              </p>
              <TextArea
                autoSize={{ minRows: 1, maxRows: 4 }}
                value={Object.values(table?.column_mapping).join("  |  ")}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <p style={{ fontWeight: "bold", marginBottom: 0 }}>
                Total filter groups:
              </p>
              <p style={{ margin: 0 }}>{table.filter_list?.length || "None"}</p>
            </Col>
            <Col span={12}>
              <p style={{ fontWeight: "bold", marginBottom: 0 }}>
                Total sorts:
              </p>
              <p style={{ margin: 0 }}>
                {Object.keys(table.sort_list).length || "None"}
              </p>
            </Col>
          </Row>
        </div>
      ))}
    </>
  );
};

export default EmailTableCard;
