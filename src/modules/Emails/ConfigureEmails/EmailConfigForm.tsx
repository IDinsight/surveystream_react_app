import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Radio } from "antd";
import { RootState } from "../../../redux/store";
import {
  createEmailConfig,
  getEmailConfigs,
  updateEmailConfig,
} from "../../../redux/emails/emailsActions";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { getAllUsers } from "../../../redux/userManagement/userManagementActions";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { update } from "lodash";

const { Option } = Select;

const EmailConfigForm = ({ handleContinue, configTypes, sctoForms }: any) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector((state: RootState) => state.emails.loading);
  const userLoading = useAppSelector(
    (state: RootState) => state.userManagement.loading
  );
  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };

  const [loading, setLoading] = useState(false);
  const [configUid, setConfigUid] = useState(null);
  const [surveyUsers, setSurveyUsers] = useState([]);
  const [sourceType, setSourceType] = useState("");
  const [selectedConfigType, setSelectedConfigType] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [emailConfigTypes, setEmailConfigTypes] = useState<any>(configTypes);

  const handleSourceChange = (e: any) => {
    setSourceType(e.target.value);
  };

  const fetchSurveyUsers = async () => {
    setLoading(true);
    const usersRes = await dispatch(getAllUsers({ survey_uid }));
    if (usersRes?.payload?.length !== 0) {
      const usersWithKeys = usersRes?.payload?.map(
        (user: any, index: { toString: () => any }) => ({
          ...user,
          key: index.toString(),
        })
      );
      setSurveyUsers(usersWithKeys);
    } else {
      message.error("Kindly setup users for the survey to configure emails");
      navigate(`/survey-information/survey-users/users/${survey_uid}`);
    }
    setLoading(false);
  };

  const handleSelectChange = (value: any) => {
    setSelectedConfigType(value);
  };

  const handleSearch = (value: any) => {
    if (value) {
      setInputValue(value);
    }
  };

  const handleInputConfirm = () => {
    if (
      inputValue &&
      !emailConfigTypes.some((type: any) => type.config_type === inputValue)
    ) {
      // Add the new config type

      setEmailConfigTypes([
        ...emailConfigTypes,
        {
          config_type: inputValue,
        },
      ]);
      setSelectedConfigType(inputValue);
      form.setFieldValue("config_type", inputValue);
    }
  };
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleInputConfirm();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const configType = form.getFieldValue("config_type");
      const sctoFormUID = form.getFieldValue("scto_form_uid");
      const googleSheetLink = form.getFieldValue("google_sheet_link");
      const headerRow = form.getFieldValue("header_row");
      const notificationUsers = form.getFieldValue("notification_users");
      const emailDataSource = form.getFieldValue("email_data_source");

      console.log("configType", configType);

      //check if config type exists
      const checkConfigs = configTypes.filter((type: any) => {
        return type.config_type == configType;
      });
      console.log("checkConfigs", checkConfigs);
      if (checkConfigs.length > 0) {
        //
        setLoading(false);
        console.log("config type exists");

        message.warning(
          "The configuration type name already exists updating the data and then proceeding to setting up schedules"
        );

        //TODO: maybe perform an update here, details like notification users may change
        const emailConfigData = {
          form_uid: sctoFormUID,
          config_type: configType,
          google_sheet_link: googleSheetLink,
          email_data_source: emailDataSource,
          google_sheet_header_row: headerRow,
          nofication_users: notificationUsers,
        };

        console.log("emailConfigData", emailConfigData);

        const emailConfigUid = checkConfigs[0]?.email_config_uid;

        const response = await dispatch(
          updateEmailConfig({
            id: emailConfigUid,
            emailConfigData: emailConfigData,
          })
        );

        if (response.payload.success) {
          const emailConfigUid = response.payload.data?.data?.email_config_uid;

          message.success(response.payload.data.message);

          handleContinue(emailConfigUid);
        } else {
          message.error(
            response.payload?.error?.message
              ? response.payload?.error?.message
              : "An error occurred, could not save email config data, kindly check form values and try again"
          );
        }
      } else {
        const emailConfigData = {
          form_uid: sctoFormUID,
          config_type: configType,
          google_sheet_link: googleSheetLink,
          email_data_source: emailDataSource,
          google_sheet_header_row: headerRow,
          nofication_users: notificationUsers,
        };

        console.log("emailConfigData", emailConfigData);

        const response = await dispatch(createEmailConfig(emailConfigData));

        console.log("config form response", response);

        if (response.payload.success) {
          const emailConfigUid = response.payload.data?.data?.email_config_uid;

          message.success(response.payload.data.message);

          handleContinue(emailConfigUid);
        } else {
          message.error(
            response.payload?.error?.message
              ? response.payload?.error?.message
              : "An error occurred, could not save email config data, kindly check form values and try again"
          );
        }
      }
    } catch (error) {
      console.log("error", error);

      message.error("Failed to update email configuration");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!sctoForms) {
      message.error("SCTO forms not loaded");
      navigate(`/module-configuration/emails/${survey_uid}`);
    }
    fetchSurveyUsers();

    setEmailConfigTypes(configTypes);
  }, [configTypes]);

  if (isLoading || userLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ scto_form_uid: sctoForms[0]?.form_uid }}
    >
      <Form.Item
        name="scto_form_uid"
        label="SCTO form ID"
        rules={[
          {
            required: true,
            message: "Please select the scto form for the configuration",
          },
        ]}
      >
        <Select showSearch placeholder="Select an scto form">
          {/* Render existing config types as options */}
          {sctoForms.length > 0
            ? sctoForms.map((form: any) => (
                <Option key={form?.form_uid} value={form?.form_uid}>
                  {form?.form_name}
                </Option>
              ))
            : null}
        </Select>
      </Form.Item>
      <Form.Item
        name="config_type"
        label="Configuration Type"
        rules={[
          {
            required: true,
            message:
              "Please select or enter configuration type example: Finance , Assignments",
          },
        ]}
      >
        <Select
          showSearch
          autoClearSearchValue={false}
          placeholder="Select or enter configuration type"
          onChange={handleSelectChange}
          onSearch={handleSearch}
          onKeyDown={handleKeyDown}
          value={selectedConfigType || inputValue}
          filterOption={(input, option) =>
            option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {/* Render existing config types as options */}
          {emailConfigTypes.length > 0 &&
            emailConfigTypes.map((type: any) => (
              <Option key={type.email_config_uid} value={type.config_type}>
                {type.config_type}
              </Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="notification_users"
        label="Select the name(s) of the team member(s) to be notified on successfully sending emails. The team members will be notified via an email. "
        rules={[
          {
            required: true,
            message:
              "Please select the users to notify on this email configuration",
          },
        ]}
      >
        <Select
          showSearch
          mode="tags"
          autoClearSearchValue={false}
          placeholder="Select the users to notify"
        >
          {/* Render existing config types as options */}
          {surveyUsers.length > 0
            ? surveyUsers.map((user: any) => (
                <Option key={user?.user_uid} value={user?.user_uid}>
                  {user?.first_name} {user?.last_name}
                </Option>
              ))
            : null}
        </Select>
      </Form.Item>

      <Form.Item
        name="email_data_source"
        label="Select the source of Emails"
        rules={[
          { required: true, message: "Please select the source of Emails" },
        ]}
      >
        <Radio.Group onChange={handleSourceChange}>
          <Radio value="google_sheet">Google Sheet</Radio>
          <Radio value="surveystream_data">SurveyStream Data</Radio>
        </Radio.Group>
      </Form.Item>

      {sourceType === "google_sheet" && (
        <>
          <Form.Item
            name="google_sheet_link"
            label="Link to Google Sheet"
            rules={[
              {
                required: true,
                message: "Please provide the link to the Google Sheet",
              },
            ]}
          >
            <Input placeholder="Enter Google Sheet link" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="button"
              onClick={() => {
                /* Add load functionality here */
              }}
            >
              Load
            </Button>
          </Form.Item>

          <Form.Item
            name="google_sheet_header_row"
            label="Header Row"
            rules={[
              {
                required: true,
                message: "Please specify the header row number",
              },
            ]}
          >
            <Input placeholder="Enter header row number" type="number" />
          </Form.Item>
        </>
      )}

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
