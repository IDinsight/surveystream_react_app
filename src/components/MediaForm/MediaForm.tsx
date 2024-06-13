import { Col, Input, Row, Select } from "antd";
import { FormItemLabel } from "../../modules/MediaAudits/MediaAudits.styled";

function MediaForm({ data }: any) {
  return (
    <>
      <div
        style={{ backgroundColor: "#FAFAFA", padding: 24, marginBottom: 24 }}
      >
        <Row align="middle" style={{ marginBottom: 6 }}>
          <Col span={6}>
            <FormItemLabel>Main SCTO form:</FormItemLabel>
          </Col>
          <Col span={8}>
            <Select
              disabled
              value={data.scto_form_id}
              style={{ width: "100%" }}
            >
              <Select.Option value={data.scto_form_id}>
                {data.scto_form_id}
              </Select.Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle" style={{ marginBottom: 6 }}>
          <Col span={6}>
            <FormItemLabel>Media Audit type:</FormItemLabel>
          </Col>
          <Col span={8}>
            <Select disabled value={data.file_type} style={{ width: "100%" }}>
              <Select.Option value={data.file_type}>
                {data.file_type}
              </Select.Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle" style={{ marginBottom: 6 }}>
          <Col span={6}>
            <FormItemLabel>Media Audit source:</FormItemLabel>
          </Col>
          <Col span={8}>
            <Select disabled value={data.source} style={{ width: "100%" }}>
              <Select.Option value={data.source}>{data.source}</Select.Option>
            </Select>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default MediaForm;
