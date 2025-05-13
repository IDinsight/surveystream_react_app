import { MailOutlined } from "@ant-design/icons";
import { Form, Button, message, Drawer, Layout } from "antd";
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

import Container from "../../components/Layout/Container";
import SideMenu from "./SideMenu";
import { getEmailDetails } from "../../redux/emails/emailsActions";
import ManualTriggers from "./ManualTriggers/ManualTriggers";
import { getEnumerators } from "../../redux/enumerators/enumeratorsActions";
import ManualEmailTriggerForm from "./ManualTriggers/ManualTriggerForm";
import EmailTemplates from "./EmailTemplates/EmailTemplates";

const { Content } = Layout;
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
  const [manualTriggersData, setManualTriggersData] = useState<any[]>([]);
  const [templatesData, setTemplatesData] = useState<any[]>([]);
  const [emailConfigData, setEmailConfigData] = useState<any>([]);

  const isLoading = useAppSelector((state: RootState) => state.emails.loading);

  const [sctoForms, setSCTOForms] = useState<any[]>([]);

  const [formUID, setFormUID] = useState<string>();

  const [loading, setLoading] = useState(false);

  const [surveyEnumerators, setSurveyEnumerators] = useState<any[]>([]);

  const [isAddManualDrawerVisible, setIsAddManualDrawerVisible] =
    useState(false);

  const showAddManualDrawer = () => {
    setIsAddManualDrawerVisible(true);
  };

  const closeAddManualDrawer = () => {
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

  const fetchEmailSchedules = async () => {
    setLoading(true);
    if (formUID) {
      const res = await dispatch(getEmailDetails({ form_uid: formUID }));

      if (res.payload.success) {
        const emailConfigs = res.payload?.data?.data;
        // Create a shallow copy of the emailConfigs array
        const emailConfigsCopy = [...emailConfigs];

        // Sort the copy based on the length of the schedule arrays
        const sortedEmailConfigs = emailConfigsCopy.sort((a, b) => {
          const lengthB = Array.isArray(a?.schedules) ? a.schedules.length : 0;
          const lengthA = Array.isArray(b?.schedules) ? b.schedules.length : 0;
          return lengthA - lengthB;
        });
        setEmailConfigData(sortedEmailConfigs);
        setSchedulesData(sortedEmailConfigs);
      } else {
        message.error("Could not fetch email configurations for this survey");
        setEmailConfigData([]);
        setSchedulesData([]);
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
        const triggersTableDataFlat = triggersTableData.flatMap(
          (triggersTable: any) => {
            return triggersTable.manual_triggers.map(
              (trigger: any, index: number) => {
                return {
                  key: trigger.manual_email_trigger_uid,
                  email_config_uid: triggersTable.email_config_uid,
                  config_name: triggersTable.config_name,
                  manual_email_trigger_uid: trigger.manual_email_trigger_uid,
                  date: trigger.date,
                  time: trigger.time,
                  status: trigger.status,
                  recipients: trigger.recipients,
                };
              }
            );
          }
        );
        setManualTriggersData(triggersTableDataFlat);
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

  const fetchEmailTemplates = async () => {
    setLoading(true);
    if (formUID) {
      const res = await dispatch(getEmailDetails({ form_uid: formUID }));
      if (res.payload.success) {
        const emailConfigs = res.payload?.data?.data;
        setEmailConfigData(emailConfigs);

        const templatesTableData = emailConfigs.filter(
          (emailConfig: any) => emailConfig.templates.length > 0
        );
        setTemplatesData(templatesTableData);
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
      message.error("Error fetching sctoForm");
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

    if (formUID) {
      //trigger fetch again after closing the drawer
      if (tabId === "manual") {
        fetchManualTriggers();
        getEnumeratorsList(formUID);
      } else if (tabId === "templates") {
        fetchEmailTemplates();
      } else {
        fetchEmailSchedules();
      }
    }
  }, [formUID, tabId]);

  return (
    <>
      <GlobalStyle />

      <Container surveyPage={true} />
      <HeaderContainer>
        <Title>Emails</Title>
        <div style={{ marginLeft: "auto" }}>
          <Button
            type="primary"
            style={{
              marginLeft: "25px",
              backgroundColor: "#2F54EB",
            }}
            icon={<MailOutlined />}
            loading={loading || isLoading}
            onClick={
              tabId === "manual"
                ? handleCreateManualTrigger
                : tabId === "templates"
                ? handleConfigureEmails
                : handleConfigureEmails
            }
          >
            {tabId === "manual"
              ? "Create Manual Email Trigger"
              : tabId === "templates"
              ? "Create Email Template"
              : "Configure Emails"}
          </Button>
        </div>
      </HeaderContainer>

      {isLoading || loading ? (
        <FullScreenLoader />
      ) : (
        <Layout>
          <SideMenu></SideMenu>
          <Content>
            <BodyWrapper>
              {tabId === "manual" ? (
                <ManualTriggers
                  data={manualTriggersData}
                  surveyEnumerators={surveyEnumerators}
                  emailConfigData={emailConfigData}
                  fetchManualTriggers={fetchManualTriggers}
                />
              ) : tabId === "templates" ? (
                <EmailTemplates
                  templatesData={templatesData}
                  fetchEmailTemplates={fetchEmailTemplates}
                />
              ) : (
                <EmailSchedules
                  data={schedulesData}
                  fetchEmailSchedules={fetchEmailSchedules}
                  sctoForms={sctoForms}
                />
              )}
            </BodyWrapper>
          </Content>
        </Layout>
      )}

      <Drawer
        title={"Create Manual Trigger"}
        width={650}
        onClose={closeAddManualDrawer}
        open={isAddManualDrawerVisible}
        style={{ paddingBottom: 80, fontFamily: "Lato" }}
      >
        <ManualEmailTriggerForm
          closeAddManualDrawer={closeAddManualDrawer}
          surveyEnumerators={surveyEnumerators}
          emailConfigData={emailConfigData}
          fetchManualTriggers={fetchManualTriggers}
        />
      </Drawer>
    </>
  );
}

export default Emails;
