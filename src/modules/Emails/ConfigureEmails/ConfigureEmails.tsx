import {
  CloseCircleOutlined,
  MailOutlined,
  MailTwoTone,
  PushpinOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  TimePicker,
  Radio,
  Form,
  Alert,
  message,
} from "antd";
import { useEffect, useState } from "react";

import { useForm } from "antd/es/form/Form";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ErrorHandler from "../../../components/ErrorHandler";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { AssignmentPayload } from "../../../redux/assignments/types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { GlobalStyle } from "../../../shared/Global.styled";
import { EmailConfigurationSteps } from "./ConfigureEmails.styled";
import { RootState } from "../../../redux/store";
import Header from "../../../components/Header";
import Container from "../../../components/Layout/Container";
import { HeaderContainer, Title } from "../../../shared/Nav.styled";
import EmailConfigForm from "./EmailConfigForm";
import EmailScheduleForm from "./EmailScheduleForm";
import EmailTemplateForm from "./EmailTemplateForm";
import { getEmailConfigs } from "../../../redux/emails/emailsActions";

function ConfigureEmails() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector((state: RootState) => state.emails.loading);

  // State variables for component
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [selectedSurveyorRows, setSelectedSurveyorRows] = useState<any>([]);
  const [targetAssignments, setTargetAssignments] = useState<any[]>([]);
  const [assignmentPayload, setAssignmentPayload] = useState<
    AssignmentPayload[]
  >([]);
  const [surveyorsFilter, setSurveyorsFilter] = useState(null);
  const [assignmentResponseData, setAssignmentResponseData] = useState<any>();
  const [nextEmailDate, setNextEmailDate] = useState<string>();

  const [manualTriggerData, setManualTriggerData] = useState({
    date: null,
    time: null,
  });
  const [manualTriggerForm] = useForm();
  const [emailMode, setEmailMode] = useState<string | null>(null);
  const [stepLoading, setStepLoading] = useState<boolean>(false);
  const [configTypes, setConfigTypes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [configUid, setConfigUid] = useState(null);

  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };

  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };

  const handleContinue = async () => {
    console.log("handle continue");

    setStepLoading(true);

    if (stepIndex < 1) {
      setStepIndex((prev: number) => prev + 1);
      setStepLoading(false);
    }
  };

  const handleDismiss = (): void => {
    navigate(-1);
  };

  const fetchEmailConfigs = async () => {
    console.log("fetchEmailConfigs");

    if (form_uid) {
      const configResponse = await dispatch(getEmailConfigs({ form_uid }));
      console.log("configResponse", configResponse.payload.data.data);
      if (configResponse.payload?.success) {
        setConfigTypes(configResponse.payload.data.data);
      }
    } else {
      message.error(
        "Cannot fetch email configs, kindly check that the form_uid is provided"
      );
      navigate(`/module-configuration/emails/${survey_uid}`);
    }
  };

  useEffect(() => {
    fetchEmailConfigs();
  }, []);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <GlobalStyle />
      <Header />
      <Container />
      <HeaderContainer>
        <MailOutlined
          style={{ fontSize: 24, marginRight: 5, color: "#BFBFBF" }}
        />
        <Title>Survey email configuration</Title>
        <div style={{ display: "flex", marginLeft: "auto" }}>
          <Button
            onClick={() => navigate(-1)}
            style={{ marginLeft: 20 }}
            icon={<CloseCircleOutlined />}
          >
            Dismiss
          </Button>
        </div>
      </HeaderContainer>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 28,
            backgroundColor: "#F5F5F5",
            height: 50,
          }}
        >
          <EmailConfigurationSteps
            style={{
              width: 700,
            }}
            current={stepIndex}
            items={[
              {
                title: "Email Config",
              },
              {
                title: "Email Schedules",
              },
              {
                title: "Email Templates",
              },
            ]}
          />
        </div>
        <br />
        <div
          style={{
            height: "calc(100vh - 190px)",
            padding: "40px",
            margin: "auto",
            width: "40%",
          }}
        >
          {stepIndex === 0 ? (
            <EmailConfigForm
              handleContinue={handleContinue}
              configTypes={configTypes}
            ></EmailConfigForm>
          ) : null}
          {stepIndex === 1 ? (
            <EmailScheduleForm
              handleContinue={handleContinue}
            ></EmailScheduleForm>
          ) : null}
          {stepIndex === 2 ? (
            <EmailTemplateForm
              handleContinue={handleContinue}
            ></EmailTemplateForm>
          ) : null}
        </div>
      </div>
    </>
  );
}

function ConfigureEmailsWithErrorBoundary() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler}>
      <ConfigureEmails />
    </ErrorBoundary>
  );
}

export default ConfigureEmailsWithErrorBoundary;
