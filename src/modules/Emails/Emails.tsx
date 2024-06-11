import { format } from "date-fns";
import { MailOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  DatePicker,
  Drawer,
  TimePicker,
} from "antd";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import { RootState } from "../../redux/store";
import { GlobalStyle } from "../../shared/Global.styled";
import EmailSchedules from "./EmailSchedules/EmailSchedules";
import { BodyWrapper } from "./Emails.styled";
import { HeaderContainer, Title } from "../../shared/Nav.styled";
import { getSurveyCTOForm } from "../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Header from "../../components/Header";
import Container from "../../components/Layout/Container";
import SideMenu from "./SideMenu";
import {
  createManualEmailTrigger,
  getEmailDetails,
} from "../../redux/emails/emailsActions";
import ManualTriggers from "./ManualTriggers/ManualTriggers";
import { getEnumerators } from "../../redux/enumerators/enumeratorsActions";

function Emails() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const { tabId } = useParams<{ tabId: string }>() ?? {
    tabId: "",
  };
  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };
  const [schedulesData, setSchedulesData] = useState<any[]>([]);
  const [manualTriggersData, setManaualTriggersData] = useState<any[]>([]);
  const [emailConfigData, setEmailConfigData] = useState<any>([]);

  const isLoading = useAppSelector((state: RootState) => state.emails.loading);

  const [sctoForms, setSCTOForms] = useState<any[]>([]);

  const [formUID, setFormUID] = useState<string>();

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [surveyEnumerators, setSurveyEnumerators] = useState<any[]>([]);

  const [isAddManualDrawerVisible, setIsAddManualDrawerVisible] =
    useState(false);

  const showAddManualDrawer = () => {
    setIsAddManualDrawerVisible(true);
  };

  const closeAddManaualDrawer = () => {
    setIsAddManualDrawerVisible(false);
  };

  const handleCreateManualTrigger = () => {
    showAddManualDrawer();
  };

  const handleConfigureEmails = () => {
    navigate(`/module-configuration/emails/${survey_uid}/create`, {
      state: { sctoForms: sctoForms },
    });
  };

  const handleAddManualTriggerSubmit = async () => {
    setFormLoading(true);

    await form.validateFields();
    const formData = form.getFieldsValue();

    const formattedDate = formData?.date.format("YYYY-MM-DD");
    const formattedTime = formData?.time.format("HH:mm");

    const manualTriggerData = {
      ...formData,
      date: formattedDate,
      time: formattedTime,
    };

    try {
      if (Object.keys(formData).length !== 0) {
        const res = await dispatch(createManualEmailTrigger(manualTriggerData));
        if (res.payload.success) {
          message.success("Email manual trigger created successfully");
          closeAddManaualDrawer();
          await fetchManualTriggers();
        } else {
          message.error(res.payload.message);
        }
      } else {
        message.error("Form data is empty");
      }
    } catch (error) {
      console.error("error", error);
      message.error("Failed to create manual email trigger");
    }

    setFormLoading(false);
  };

  const fetchEmailSchedules = async () => {
    setLoading(true);
    if (formUID) {
      const res = await dispatch(getEmailDetails({ form_uid: formUID }));

      if (res.payload.success) {
        const emailConfigs = res.payload?.data?.data;
        setEmailConfigData(emailConfigs);
        const scheduleTableData = emailConfigs;
        setSchedulesData(scheduleTableData);
      } else {
        message.error("Could not fetch email configurations for this survey");
      }
    } else {
      message.error(
        "Cannot fetch email configurations, kindly check that the form_uid is provided"
      );
      navigate(`/module-configuration/emails/${survey_uid}`);
    }
    setLoading(false);
  };

  const fetchManualTriggers = async () => {
    setLoading(true);
    if (formUID) {
      const res = await dispatch(getEmailDetails({ form_uid: formUID }));
      if (res.payload.success) {
        const emailConfigs = res.payload?.data?.data;
        setEmailConfigData(emailConfigs);

        const triggersTableData = emailConfigs.filter(
          (emailConfig: any) => emailConfig.manual_triggers.length > 0
        );
        setManaualTriggersData(triggersTableData);
      } else {
        message.error("Could not fetch email configurations for this survey");
      }
    } else {
      message.error(
        "Cannot fetch email configurations, kindly check that the form_uid is provided"
      );
      navigate(`/module-configuration/emails/${survey_uid}`);
    }
    setLoading(false);
  };

  const scheduleColumns = [
    {
      title: "Config Type",
      dataIndex: "config_type",
      key: "config_type",
    },
    {
      title: "Schedules",
      key: "schedules",
      render: (
        _: any,
        record: {
          schedules: {
            dates: string[];
            time: string;
            email_schedule_name: string;
          }[];
        }
      ) => (
        <div>
          {record.schedules.length > 0 ? (
            record.schedules.map((schedule, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <p>Schedule Name: {schedule?.email_schedule_name}</p>
                <p>
                  Dates:{" "}
                  {schedule.dates
                    .map((date) => format(new Date(date), "MMM dd, yyyy"))
                    .join(", ")}
                </p>
                <p>
                  Time:{" "}
                  {format(new Date(`1970-01-01T${schedule.time}Z`), "hh:mm a")}
                </p>
                {index < record.schedules.length - 1 && <hr />}
              </div>
            ))
          ) : (
            <p>No schedules available</p>
          )}
        </div>
      ),
    },
    {
      title: "Templates",
      key: "templates",
      render: (
        _: any,
        record: {
          templates: {
            language: string;
            subject: string;
            content: string;
          }[];
        }
      ) => (
        <div>
          {record.templates.length > 0 ? (
            record.templates.map((template, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <p>Language: {template?.language}</p>
                <p>Subject: {template?.subject}</p>

                <p>Content: {template?.content}</p>

                {index < record.templates.length - 1 && <hr />}
              </div>
            ))
          ) : (
            <p>No templates available</p>
          )}
        </div>
      ),
    },
  ];

  const manualTriggerColumns = [
    {
      title: "Config Type",
      dataIndex: "config_type",
      key: "config_type",
    },
    {
      title: "Manual Triggers",
      key: "manual_triggers",
      render: (
        _: any,
        record: {
          manual_triggers: {
            date: string;
            time: string;
            status: string;
            receipients: string[];
          }[];
        }
      ) => (
        <div>
          {record.manual_triggers.length > 0 ? (
            record.manual_triggers.map((manual_trigger, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <p>Date: {manual_trigger?.date}</p>
                <p>
                  Time:{" "}
                  {format(
                    new Date(`1970-01-01T${manual_trigger.time}Z`),
                    "hh:mm a"
                  )}
                </p>
                <p>Status: {manual_trigger?.status}</p>

                {/* <p>
                  Dates:{" "}
                  {schedule.dates
                    .map((date) => format(new Date(date), "MMM dd, yyyy"))
                    .join(", ")}
                </p> */}

                {index < record.manual_triggers.length - 1 && <hr />}
              </div>
            ))
          ) : (
            <p>No manual triggers available</p>
          )}
        </div>
      ),
    },
    {
      title: "Templates",
      key: "templates",
      render: (
        _: any,
        record: {
          templates: {
            language: string;
            subject: string;
            content: string;
          }[];
        }
      ) => (
        <div>
          {record.templates.length > 0 ? (
            record.templates.map((template, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <p>Language: {template?.language}</p>
                <p>Subject: {template?.subject}</p>

                <p>Content: {template?.content}</p>

                {index < record.templates.length - 1 && <hr />}
              </div>
            ))
          ) : (
            <p>No templates available</p>
          )}
        </div>
      ),
    },
  ];

  const handleFormUID = async () => {
    try {
      setLoading(true);
      const sctoForm = await dispatch(
        getSurveyCTOForm({ survey_uid: survey_uid })
      );

      if (sctoForm?.payload[0]?.form_uid) {
        setFormUID(sctoForm?.payload[0]?.form_uid);

        setSCTOForms(sctoForm?.payload);
      } else {
        message.error("Kindly configure SCTO Form to proceed");
        navigate(`/survey-information/survey-cto-information/${survey_uid}`);
      }
    } catch (error) {
      console.log("Error fetching sctoForm:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEnumeratorsList = async (form_uid: string) => {
    setLoading(true);
    const enumeratorRes = await dispatch(getEnumerators({ formUID: form_uid }));

    if (enumeratorRes.payload.status == 200) {
      setSurveyEnumerators(enumeratorRes.payload.data.data);
    } else {
      message.error("Enumerators failed to load, kindly reload to try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    handleFormUID();

    if (formUID && tabId == "manual") {
      fetchManualTriggers();
      getEnumeratorsList(formUID);
    } else if (formUID) {
      fetchEmailSchedules();
    }
  }, [formUID, tabId]);

  return (
    <>
      <GlobalStyle />
      <Header />
      <Container />
      <HeaderContainer>
        <Title>Emails</Title>
        <div style={{ marginLeft: "auto" }}>
          {tabId != "manual" ? (
            <Button
              type="primary"
              style={{
                marginLeft: "25px",
                backgroundColor: "#2F54EB",
              }}
              icon={<MailOutlined />}
              onClick={handleConfigureEmails}
            >
              Configure Emails
            </Button>
          ) : (
            <Button
              type="primary"
              style={{
                marginLeft: "25px",
                backgroundColor: "#2F54EB",
              }}
              icon={<MailOutlined />}
              loading={loading || isLoading}
              onClick={handleCreateManualTrigger}
            >
              Create Manual Email Trigger
            </Button>
          )}
        </div>
      </HeaderContainer>

      {isLoading || loading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu></SideMenu>
          <BodyWrapper>
            {tabId === "manual" ? (
              <ManualTriggers
                columns={manualTriggerColumns}
                data={manualTriggersData}
              />
            ) : (
              <EmailSchedules columns={scheduleColumns} data={schedulesData} />
            )}
          </BodyWrapper>
        </div>
      )}

      <Drawer
        title={"Create Manual Trigger"}
        width={650}
        onClose={closeAddManaualDrawer}
        open={isAddManualDrawerVisible}
        style={{ paddingBottom: 80, fontFamily: "Lato" }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="email_config_uid"
            label="Email Configuration"
            rules={[
              {
                required: true,
                message: "Please select an email configuration",
              },
            ]}
          >
            <Select
              placeholder="Select email configuration"
              options={emailConfigData.map((config: any) => ({
                label: config?.config_type,
                value: config?.email_config_uid,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select the date" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="time"
            label="Time"
            rules={[{ required: true, message: "Please select the time" }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="recipients"
            label="Recipients"
            rules={[
              { required: false, message: "Please select the recipients" },
            ]}
          >
            <Select
              showSearch
              mode="multiple"
              placeholder="Select recipients"
              options={surveyEnumerators.map((enumerator: any) => ({
                label: enumerator.name,
                value: enumerator.enumerator_id,
              }))}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleAddManualTriggerSubmit}
              loading={formLoading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}

export default Emails;
