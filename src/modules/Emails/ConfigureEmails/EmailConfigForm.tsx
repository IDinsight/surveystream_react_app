import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import axios from "axios";
import {
  createEmailConfig,
  getEmailConfigs,
} from "../../../redux/emails/emailsActions";
import { useAppDispatch } from "../../../redux/hooks";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const EmailConfigForm = ({ handleContinue, configTypes }: any) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [configUid, setConfigUid] = useState(null);

  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };

  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const configType = form.getFieldValue("config_type")[0];

      console.log("configType", configType);

      //check if config type exists

      if (
        configTypes.filter((type: any) => {
          return type.config_type == configType;
        })
      ) {
        //
        setLoading(false);
        console.log("config type exists");
        handleContinue();
      } else {
        const emailConfigData = {
          form_uid: form_uid,
          config_type: configType,
        };

        console.log("emailConfigData", emailConfigData);

        const response = await dispatch(createEmailConfig(emailConfigData));

        message.success(response.payload.data.message);
        // Set the configUid state with the returned config_uid
        handleContinue();
      }
    } catch (error) {
      console.log("error", error);

      message.error("Failed to update email configuration");
    }
    setLoading(false);
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="config_type"
        label="Configuration Type"
        rules={[
          {
            required: true,
            message: "Please select or enter configuration type",
          },
        ]}
      >
        <Select
          showSearch
          mode="tags"
          maxTagCount={1}
          autoClearSearchValue={false}
          placeholder="Select or enter configuration type"
        >
          {/* Render existing config types as options */}
          {configTypes.length > 0
            ? configTypes.map((type: any) => (
                <Option key={type?.email_config_uid} value={type?.config_type}>
                  {type?.config_type}
                </Option>
              ))
            : null}
        </Select>
      </Form.Item>

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

      {/* Display config_uid if available */}
      {configUid && <p>Config UID: {configUid}</p>}
    </Form>
  );
};

export default EmailConfigForm;
