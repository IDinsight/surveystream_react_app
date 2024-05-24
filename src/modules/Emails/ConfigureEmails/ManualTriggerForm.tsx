import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, DatePicker, message } from "antd";
import axios from "axios";

const { Option } = Select;

const ManualEmailTriggerForm = () => {
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

  const onFinish = async (values:any) => {
    setLoading(true);
    try {
      // Call backend API to add/update manual email trigger
      const response = await axios.post("/api/manual-email-trigger", values);
      message.success(response.data.message);
      form.resetFields();
    } catch (error) {
      message.error("Failed to add/update manual email trigger");
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
            <Option
              key={config.email_config_uid}
              value={config.email_config_uid}
            >
              {config.config_type}
            </Option>
          ))} */}
        </Select>
      </Form.Item>

      <Form.Item
        name="date"
        label="Date"
        rules={[{ required: true, message: "Please select date" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="time"
        label="Time"
        rules={[{ required: true, message: "Please select time" }]}
      >
        <Input type="time" />
      </Form.Item>

      {/* Other form fields for ManualEmailTrigger */}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ManualEmailTriggerForm;
