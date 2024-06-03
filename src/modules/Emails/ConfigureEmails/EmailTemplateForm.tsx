import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import axios from "axios";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const EmailTemplateForm = ({
  handleContinue,
  handleBack,
  emailConfigUID,
}: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [emailConfigs, setEmailConfigs] = useState([]);

  useEffect(() => {
    // Fetch email configurations on component mount
    fetchEmailConfigs();
  }, []);

  const fetchEmailConfigs = async () => {
    try {
      // Call backend API to fetch email configurations
      const response = await axios.get("/api/email-configs");
      setEmailConfigs(response.data.emailConfigs);
    } catch (error) {
      message.error("Failed to fetch email configurations");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formValues = form.getFieldsValue();
      console.log("formValues", formValues);
    } catch (error) {
      message.error("Failed to add/update email template");
    }
    setLoading(false);
  };

  return (
    <Form form={form} layout="vertical">
      <Form.List name="templates" initialValue={[{ dateType: "single" }]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} style={{ marginBottom: 8 }}>
                {fields.length > 1 && (
                  <MinusCircleOutlined
                    onClick={() => remove(name)}
                    style={{ float: "right" }}
                  />
                )}
                <Form.Item
                  {...restField}
                  name="subject"
                  label="Subject"
                  rules={[{ required: true, message: "Please enter subject" }]}
                >
                  <Input placeholder="Enter subject" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name="language"
                  label="Language"
                  rules={[
                    { required: true, message: "Please select language" },
                  ]}
                >
                  <Input placeholder="Enter language" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name="content"
                  label="Content"
                  rules={[{ required: true, message: "Please enter content" }]}
                >
                  <Input.TextArea
                    rows={5}
                    placeholder='Enter content using the variables indicated by ${}, for instance, "Hello, ${enumerator_name}."'
                  />
                </Form.Item>
              </div>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add another language
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <div>
        <Button
          style={{
            display: "flex",
            float: "left",
          }}
          loading={loading}
          onClick={handleBack}
        >
          Back
        </Button>

        <Button
          type="primary"
          style={{
            display: "flex",
            backgroundColor: "#597EF7",
            color: "white",
            float: "right",
          }}
          loading={loading}
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </div>
    </Form>
  );
};

export default EmailTemplateForm;
