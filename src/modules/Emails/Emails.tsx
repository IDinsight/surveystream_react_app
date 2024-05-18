import { MailOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import { RootState } from "../../redux/store";
import { GlobalStyle } from "../../shared/Global.styled";
import EmailSchedules from "./EmailSchedules/EmailSchedules";
import { setLoading } from "../../redux/emails/emailsSlice";
import { BodyWrapper } from "./Emails.styled";
import { HeaderContainer, Title } from "../../shared/Nav.styled";
import { getSurveyCTOForm } from "../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Header from "../../components/Header";
import Container from "../../components/Layout/Container";
import SideMenu from "./SideMenu";
import {
  getEmailConfigs,
  getEmailSchedules,
  getManualEmailTriggers,
} from "../../redux/emails/emailsActions";

function Emails() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { form_uid = "", tabId = "" } =
    useParams<{
      form_uid?: string;
      tabId?: string;
    }>() ?? {};
  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };
  const [schedulesData, setSchedulesData] = useState<any[]>([]);
  const [manualTriggersData, setManaualTriggersData] = useState<any[]>([]);

  const isLoading = useAppSelector((state: RootState) => state.emails.loading);

  const fetchEmailConfigs = async () => {
    console.log("fetchEmailConfigs");

    if (form_uid) {
      const configResponse = await dispatch(getEmailConfigs({ form_uid }));
      console.log("configResponse", configResponse);
    } else {
      message.error(
        "Cannot fetch email configs, kindly check that the form_uid is provided"
      );
      navigate(`/module-configuration/emails/${survey_uid}`);
    }
  };

  const fetchManualTriggers = async (email_config_uid: string) => {
    console.log("fetchEmailSchedules");

    const manualTriggersRes = await dispatch(
      getManualEmailTriggers({ email_config_uid })
    );
    console.log("manualTriggersRes", manualTriggersRes);
  };
  const fetchEmailSchedules = async (email_config_uid: string) => {
    console.log("fetchEmailSchedules");

    const manualTriggersRes = await dispatch(
      getEmailSchedules({ email_config_uid })
    );
    console.log("manualTriggersRes", manualTriggersRes);
  };

  const combineScheduleData = async () => {
    try {
      // // Combine data from both responses based on email_config_uid
      // const combinedData = configResponse.payload.data.map(
      //   (config: { email_config_uid: any }) => ({
      //     ...config,
      //     schedule: scheduleResponse.payload.data.find(
      //       (schedule: { email_config_uid: any }) =>
      //         schedule.email_config_uid === config.email_config_uid
      //     ),
      //   })
      // );
      // setData(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const combineTriggersData = async () => {
    console.log("combineTriggerData");
  };

  const combineSchedulesData = async () => {
    console.log("combineTriggerData");
  };

  const scheduleColumns = [
    {
      title: "Email Config Type",
      dataIndex: "config_type",
      key: "config_type",
    },
    {
      title: "Schedule",
      key: "schedule",
      render: (
        _: any,
        record: {
          schedule: {
            dates: any[];
            time: string;
          };
        }
      ) => (
        <div>
          <p>Dates: {record.schedule?.dates.join(", ")}</p>
          <p>Time: {record.schedule?.time}</p>
        </div>
      ),
    },
  ];

  const handleFormUID = async () => {
    console.log("handleFormUID", handleFormUID);

    if (!form_uid) {
      try {
        dispatch(setLoading(true));
        const sctoForm = await dispatch(
          getSurveyCTOForm({ survey_uid: survey_uid })
        );

        if (sctoForm?.payload[0]?.form_uid) {
          navigate(
            `/module-configuration/emails/${survey_uid}/${sctoForm?.payload[0]?.form_uid}/schedules`
          );
        } else {
          message.error("Kindly configure SCTO Form to proceed");
          navigate(`/survey-information/survey-cto-information/${survey_uid}`);
        }
      } catch (error) {
        console.log("Error fetching sctoForm:", error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  useEffect(() => {
    handleFormUID();
    fetchEmailConfigs();

    // if (tabId == "manual") {
    //   fetchEmailSchedules()
    // } else   {
    //   fetchManualTriggers()
    // }
  }, []);

  const handleConfigureEmails = () => {
    console.log("open emails");
    // Add logic to navigate or trigger actions for configuring emails
  };

  return (
    <>
      <GlobalStyle />
      <Header />
      <Container />
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
            onClick={() => {
              console.log("open emails");
            }}
          >
            Configure Emails
          </Button>
        </div>
      </HeaderContainer>

      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu></SideMenu>
          <BodyWrapper>
            {tabId === "manual" ? null : <EmailSchedules />}
          </BodyWrapper>
        </div>
      )}
    </>
  );
}

export default Emails;
