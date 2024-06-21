import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Radio } from "antd";
import { RootState } from "../../../redux/store";
import { updateEmailConfig } from "../../../redux/emails/emailsActions";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { getAllUsers } from "../../../redux/userManagement/userManagementActions";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";

const { Option } = Select;

const EmailConfigEditForm = ({
  initialValues,
  fetchEmailSchedules,
  sctoForms,
}: any) => {
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
  const [surveyUsers, setSurveyUsers] = useState([]);
  const [sourceType, setSourceType] = useState(
    initialValues.email_source || ""
  );

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formValues = await form.validateFields();

      const emailConfigData = {
        ...formValues,
      };

      const response = await dispatch(
        updateEmailConfig({
          id: initialValues.email_config_uid,
          emailConfigData: emailConfigData,
        })
      );

      if (response.payload?.data?.success) {
        console.log("response.payload?.data", response.payload?.data);

        message.success("Email config updated successfully");

        fetchEmailSchedules();
      } else {
        message.error(
          response.payload?.error?.message ||
            "An error occurred, could not save email config data, kindly check form values and try again"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to update email configuration");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSurveyUsers();
  }, []);

  if (isLoading || userLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Form form={form} layout="vertical" initialValues={initialValues}>
      <Form.Item
        name="form_uid"
        label="SCTO form ID"
        rules={[
          {
            required: true,
            message: "Please select the SCTO form for the configuration",
          },
        ]}
      >
        <Select showSearch placeholder="Select an SCTO form">
          {sctoForms.map((form: any) => (
            <Option key={form?.form_uid} value={form?.form_uid}>
              {form?.form_name}
            </Option>
          ))}
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
        <Input placeholder="Enter configuration type" />
      </Form.Item>
      <Form.Item
        name="report_users"
        label="Select the name(s) of the team member(s) to be notified on successfully sending emails. The team members will be notified via an email."
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
          {surveyUsers.map((user: any) => (
            <Option key={user?.user_uid} value={user?.user_uid}>
              {user?.first_name} {user?.last_name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="email_source"
        label="Select the source of Emails"
        rules={[
          { required: true, message: "Please select the source of Emails" },
        ]}
      >
        <Radio.Group onChange={handleSourceChange}>
          <Radio value="Google Sheet">Google Sheet</Radio>
          <Radio value="SurveyStream Data">SurveyStream Data</Radio>
        </Radio.Group>
      </Form.Item>

      {sourceType === "Google Sheet" && (
        <>
          <Form.Item
            name="email_source_gsheet_link"
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
            name="email_source_gsheet_tab"
            label="Google Sheet Tab"
            rules={[
              {
                required: true,
                message: "Please provide the tab to the Google Sheet",
              },
            ]}
          >
            <Input placeholder="Enter Google Sheet tab" />
          </Form.Item>

          <Form.Item
            name="email_source_gsheet_header_row"
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
    </Form>
  );
};

export default EmailConfigEditForm;
