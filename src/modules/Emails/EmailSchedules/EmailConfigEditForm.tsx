import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Radio, Checkbox } from "antd";
import { RootState } from "../../../redux/store";
import {
  updateEmailConfig,
  getEmailGsheet,
} from "../../../redux/emails/emailsActions";
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
  const [pdfAttachment, setPdfAttachment] = useState<boolean>(
    initialValues.pdf_attachment
  );
  const [pdfEncryption, setPdfEncryption] = useState<boolean>(
    initialValues.pdf_encryption
  );
  const [pdfPassword, setPdfPassword] = useState(
    initialValues.pdfPassword || ""
  );
  const [gsheetColumnHeader, setGsheetColumnHeader] = useState<string[]>([]);
  const [loadingGsheet, setGsheet] = useState(false);

  const handleGsheetColumnHeaderChange = (e: Array<string>) => {
    setGsheetColumnHeader(e);
  };

  const handleSourceChange = (e: any) => {
    setSourceType(e.target.value);
  };

  const handlePdfAttachmentChange = (e: any) => {
    setPdfAttachment(e.target.value);
  };
  const handlePdfEncryptionChange = (e: any) => {
    setPdfEncryption(e.target.value);
  };
  const handlePdfPasswordChange = (e: any) => {
    setPdfPassword(e.target.value);
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

  const handleGsheetsLoad = async () => {
    setGsheet(true);
    try {
      const sctoFormUID = form.getFieldValue("scto_form_uid");
      const gsheetLink = form.getFieldValue("email_source_gsheet_link");
      const gsheetTab = form.getFieldValue("email_source_gsheet_tab");
      const gsheetHeaderRow = form.getFieldValue(
        "email_source_gsheet_header_row"
      );

      const emailGsheetPayload = {
        form_uid: sctoFormUID,
        email_source_gsheet_link: gsheetLink,
        email_source_gsheet_tab: gsheetTab,
        email_source_gsheet_header_row: gsheetHeaderRow,
      };

      const response = await dispatch(getEmailGsheet(emailGsheetPayload));

      if (response.payload.success) {
        message.success(response.payload.data.message);
        handleGsheetColumnHeaderChange(response.payload.data.data);
      } else {
        message.error(
          "Failed to load Google Sheet: " || response.payload.error.message
        );
      }
    } catch (error) {
      message.error("Failed to load Google Sheet: " || error);
    }
    setGsheet(false);
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
        message.success("Email config updated successfully");

        fetchEmailSchedules();
      } else {
        message.error(
          response.payload?.error?.message ||
            "An error occurred, could not save email config data, kindly check form values and try again"
        );
      }
    } catch (error) {
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
        tooltip="Select the SCTO form to be used for the email configuration"
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
        name="config_name"
        label="Configuration Name"
        tooltip="This field should be unique. It will be used to identify the type of email configuration. Examples are finance emails, assignments, morning call slots etc"
        rules={[
          {
            required: true,
            message:
              "Please select or enter configuration name example: Finance , Assignments",
          },
        ]}
      >
        <Input placeholder="Enter configuration name" />
      </Form.Item>
      <Form.Item
        name="report_users"
        label="Select the name(s) of the team member(s) to be notified on successfully sending emails. The team members will be notified via an email."
        tooltip="If you do not see the user you want to notify, kindly add them to the survey users list"
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
        name="cc_users"
        label="Select the name(s) of the team member(s) to be copied on the emails sent."
        tooltip="The team members will be copied on the emails sent they will be added as CC in each email."
      >
        <Select
          showSearch
          mode="tags"
          autoClearSearchValue={false}
          placeholder="Select the users to send a copy of emails"
        >
          {/* Render existing Config Names as options */}
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
        name="email_source"
        label="Select the source of Emails"
        rules={[
          { required: true, message: "Please select the source of Emails" },
        ]}
        tooltip="Select the source of data for the emails to be sent, Source can either be a Google sheet or SurveyStream Data (Assignments, Productivity etc.)"
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
            tooltip="Provide the link to the Google Sheet that has the data that needs to be sent in the emails."
            rules={[
              {
                required: true,
                message: "Please provide the link to the Google Sheet",
              },
            ]}
          >
            <Input placeholder="Enter Google Sheet link" />
          </Form.Item>
          <Checkbox
            style={{
              fontFamily: "Lato, sans-serif",
              marginBottom: "24px",
            }}
          >
            Kindly grant Read access for the Google sheet to{" "}
            <a href="mailto:dod-sheets@data-on-demand-225320.iam.gserviceaccount.com">
              dod-sheets@data-on-demand-225320.iam.gserviceaccount.com
            </a>{" "}
          </Checkbox>
          <Form.Item
            name="email_source_gsheet_tab"
            label="Google Sheet Tab"
            tooltip="Provide the tabname on the Google Sheet containing the data to be sent in the email"
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
            tooltip="The header row should be a single row and contain column names. The header row location can be changed, but please ensure that you also update it in SurveyStream configs. The columns order can also be changed, it will be automatically picked up."
            rules={[
              {
                required: true,
                message: "Please specify the header row number",
              },
            ]}
          >
            <Input placeholder="Enter header row number" type="number" />
          </Form.Item>
          <Form.Item>
            <Button
              type="default"
              htmlType="button"
              onClick={() => {
                handleGsheetsLoad();
              }}
              loading={loadingGsheet}
            >
              Load Google sheet headers
            </Button>
          </Form.Item>
        </>
      )}
      <Form.Item
        name="pdf_attachment"
        label="Do you want to send the content of the emails as a PDF attachment?"
        tooltip="Select Yes if you want to attach a PDF of tables in the email"
        rules={[
          {
            required: true,
            message: "Please specify the PDF attachment preference",
          },
        ]}
      >
        <Radio.Group onChange={handlePdfAttachmentChange}>
          <Radio value={true}>Yes</Radio>
          <Radio value={false}>No</Radio>
        </Radio.Group>
      </Form.Item>
      {pdfAttachment && (
        <>
          <Form.Item
            name="pdf_encryption"
            label="Do you want to attach a PDF to the email?"
            tooltip="Select Yes if you want to encrypt and password protect the PDF attachment in the email"
            rules={[
              {
                required: true,
                message: "Please Select the PDF encryption preference",
              },
            ]}
          >
            <Radio.Group onChange={handlePdfEncryptionChange}>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
          {pdfEncryption && (
            <>
              <Form.Item
                name="pdf_encryption_password_type"
                label="Select the password type for the encrypted PDF attachment"
                tooltip="The password can be of 2 types: it can follow a fixed pattern (i.e enum_id@enum_name) or you can set a passphrase. The passphrase will be common across all enumerators."
                rules={[
                  {
                    required: true,
                    message: "Please Select the PDF encryption password type",
                  },
                ]}
              >
                <Radio.Group onChange={handlePdfPasswordChange}>
                  <Radio value="Pattern">Pattern</Radio>
                  <Radio value="Password">Passphrase</Radio>
                </Radio.Group>
              </Form.Item>
              {pdfPassword === "Password" && (
                <>
                  <Checkbox
                    style={{
                      fontFamily: "Lato, sans-serif",
                      marginBottom: "24px",
                    }}
                  >
                    Please share the Passphrase with{" "}
                    <a href="mailto:surveystream.devs@idinsight.org">
                      surveystream.devs@idinsight.org
                    </a>{" "}
                    via FlowCrypt/Dashlane.
                  </Checkbox>
                </>
              )}
            </>
          )}
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
