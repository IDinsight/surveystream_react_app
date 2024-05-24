import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import axios from "axios";

const { Option } = Select;

const EmailTemplateForm = ({ handleContinue }: any) => {
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

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Call backend API to add/update email template
      const response = await axios.post("/api/email-template", values);
      message.success(response.data.message);
      form.resetFields();
    } catch (error) {
      message.error("Failed to add/update email template");
    }
    setLoading(false);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="email_config_uid"
        label="Email Configuration"
        rules={[
          { required: true, message: "Please select email configuration" },
        ]}
      >
        <Select placeholder="Select email configuration">
          {/* Render email configurations as options */}
          {/* {emailConfigs.map((config) => (
            <Option key={config.email_config_uid} value={config.email_config_uid}>
              {config.config_type}
            </Option>
          ))} */}
        </Select>
      </Form.Item>

      <Form.Item
        name="subject"
        label="Subject"
        rules={[{ required: true, message: "Please enter subject" }]}
      >
        <Input placeholder="Enter subject" />
      </Form.Item>

      <Form.Item
        name="language"
        label="Language"
        rules={[{ required: true, message: "Please select language" }]}
      >
        <Select placeholder="Select language">
          <Option value="English">English</Option>
          <Option value="French">French</Option>
          {/* Add more language options as needed */}
        </Select>
      </Form.Item>

      <Form.Item
        name="content"
        label="Content"
        rules={[{ required: true, message: "Please enter content" }]}
      >
        <Input.TextArea rows={4} placeholder="Enter content" />
      </Form.Item>

      {/* Other form fields for EmailTemplate */}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmailTemplateForm;
