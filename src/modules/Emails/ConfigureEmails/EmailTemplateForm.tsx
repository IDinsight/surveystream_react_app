import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import axios from "axios";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../../redux/hooks";
import { createEmailTemplate } from "../../../redux/emails/emailsActions";

const { Option } = Select;

const EmailTemplateForm = ({
  handleContinue,
  handleBack,
  emailConfigUID,
}: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [emailConfigs, setEmailConfigs] = useState([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("emailConfigUID", emailConfigUID);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formValues = await form.validateFields();
      console.log("formValues", formValues);

      const { templates } = form.getFieldsValue();
      if (templates) {
        for (let i = 0; i < templates.length; i++) {
          const template = templates[i];

          const templateData = {
            email_config_uid: emailConfigUID,
            language: template.language,
            subject: template.subject,
            content: template.content,
          };

          console.log("templateData", templateData);

          const res = await dispatch(createEmailTemplate({ ...templateData }));

          console.log("createEmailTemplate res", res);

          if (!res.payload.success) {
            // Error occurred
            message.error(
              res.payload?.message
                ? res.payload?.message
                : "An error occurred, email template could not be created. Kindly check form data and try again"
            );
            setLoading(false);
            return;
          }
        }

        message.success("Email templates updated successfully");
        handleContinue(emailConfigUID);
      }
    } catch (error) {
      console.error("error", error);
      message.error("Failed to update email templates");
    }
    setLoading(false);
  };

  return (
    <Form form={form} layout="vertical">
      <Form.List name="templates" initialValue={[{}]}>
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
                  name={[name, "language"]}
                  label="Language"
                  rules={[
                    { required: true, message: "Please select language" },
                  ]}
                >
                  <Input placeholder="Enter language" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "subject"]}
                  label="Subject"
                  rules={[{ required: true, message: "Please enter subject" }]}
                >
                  <Input placeholder="Enter subject" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, "content"]}
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
