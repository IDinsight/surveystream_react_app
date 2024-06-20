import { MailOutlined } from "@ant-design/icons";
import { Form, Button, message, Drawer } from "antd";
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
import { getEmailDetails } from "../../redux/emails/emailsActions";
import ManualTriggers from "./ManualTriggers/ManualTriggers";
import { getEnumerators } from "../../redux/enumerators/enumeratorsActions";
import ManualEmailTriggerForm from "./ManualTriggers/ManualTriggerForm";

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

    if (formUID) {
      //trigger fetch again after closing the drawer
      if (tabId === "manual") {
        fetchManualTriggers();
        getEnumeratorsList(formUID);
      } else {
        fetchEmailSchedules();
      }
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
                data={manualTriggersData}
                surveyEnumerators={surveyEnumerators}
                emailConfigData={emailConfigData}
              />
            ) : (
              <EmailSchedules data={schedulesData} />
            )}
          </BodyWrapper>
        </div>
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
        />
      </Drawer>
    </>
  );
}

export default Emails;
