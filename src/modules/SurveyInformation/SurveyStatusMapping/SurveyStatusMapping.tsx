import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks";
import Container from "../../../components/Layout/Container";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import NavItems from "../../../components/NavItems";
import Header from "../../../components/Header";
import { Button, Form, Input, Select } from "antd";
import { useForm } from "antd/es/form/Form";

function SurveyStatusMapping() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = useForm();

  const isLoading = false;

  return (
    <>
      <Header items={NavItems} />
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container title="Survey status" />
          <div style={{ marginLeft: 56 }}>
            <p style={{ color: "rgba(0,0,0, 0.45)" }}>ACME / Survey status</p>
            <Form
              form={form}
              wrapperCol={{ span: 6 }}
              style={{ marginTop: 48 }}
            >
              <Form.Item
                label="SCTO form ID"
                name="password"
                required
                tooltip="This is a required field"
                rules={[
                  { required: true, message: "Please input new password!" },
                ]}
              >
                <Select placeholder="Select SCTO form ID" allowClear>
                  <Select.Option value="scto-form">SCTO form</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item shouldUpdate>
                <Button type="primary">Next</Button>
              </Form.Item>
            </Form>
          </div>
        </>
      )}
    </>
  );
}

export default SurveyStatusMapping;
