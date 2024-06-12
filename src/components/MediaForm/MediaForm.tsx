import { Col, Input, Row, Select } from "antd";
import { FormItemLabel } from "../../modules/MediaAudits/MediaAudits.styled";

function MediaForm({ data }: any) {
  return (
    <>
      <div style={{ backgroundColor: "#FAFAFA", padding: 24 }}>
        <div>
          <p style={{ fontWeight: 500 }}>{data.form_name}</p>
        </div>
        <Row align="middle" style={{ marginBottom: 6 }}>
          <Col span={6}>
            <FormItemLabel>
              <span style={{ color: "red" }}>*</span> Audio audit SCTO form ID:
            </FormItemLabel>
          </Col>
          <Col span={8}>
            <Input defaultValue={data.scto_media_form_id} />
          </Col>
        </Row>
        <Row align="middle" style={{ marginBottom: 6 }}>
          <Col span={6}>
            <FormItemLabel>
              <span style={{ color: "red" }}>*</span>Select main SCTO form:
            </FormItemLabel>
          </Col>
          <Col span={8}>
            <Select
              disabled
              value={data.scto_main_form_id}
              style={{ width: "100%" }}
            >
              <Select.Option value={data.scto_main_form_id}>
                {data.scto_main_form_id}
              </Select.Option>
            </Select>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default MediaForm;
