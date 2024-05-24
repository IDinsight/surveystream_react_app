import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import axios from "axios";

const { Option } = Select;

const EmailScheduleForm = ({ handleContinue }: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [emailConfigs, setEmailConfigs] = useState([]);

  useEffect(() => {
    // Fetch email configurations on component mount
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Call backend API to add/update email schedule
      const response = await axios.post("/api/email-schedule", values);
      message.success(response.data.message);
      form.resetFields();
    } catch (error) {
      message.error("Failed to add/update email schedule");
    }
    setLoading(false);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      {/* <Form.Item
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
      {/* </Select>
      </Form.Item> */}

      {/* Other form fields for EmailSchedule */}

      <div>
        <Button
          type="primary"
          style={{
            display: "flex",
            backgroundColor: "#597EF7",
            color: "white",
            float: "right",
          }}
          loading={loading}
          htmlType="submit"
        >
          Continue
        </Button>
      </div>
    </Form>
  );
};

export default EmailScheduleForm;
