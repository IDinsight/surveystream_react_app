import { CloseCircleOutlined, MailOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { useEffect, useState } from "react";

import { useForm } from "antd/es/form/Form";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ErrorHandler from "../../../components/ErrorHandler";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { GlobalStyle } from "../../../shared/Global.styled";
import { EmailConfigurationSteps } from "./ConfigureEmails.styled";
import { RootState } from "../../../redux/store";

import Container from "../../../components/Layout/Container";
import { HeaderContainer, Title } from "../../../shared/Nav.styled";
import EmailConfigForm from "./EmailConfigForm";
import EmailScheduleForm from "./EmailScheduleForm";
import EmailTemplateForm from "./EmailTemplateForm";
import { getEmailConfigs } from "../../../redux/emails/emailsActions";
import { getSCTOForms } from "../../../utils/helper";

function ConfigureEmails() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isLoading = useAppSelector((state: RootState) => state.emails.loading);

  // State variables for component
  const [stepIndex, setStepIndex] = useState<number>(0);

  const [stepLoading, setStepLoading] = useState<boolean>(false);
  const [configNames, setconfigNames] = useState([]);

  const [configUid, setConfigUid] = useState<string>("");
  const [sctoForms, setSctoForms] = useState<any>([]);

  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };

  const handleBack = async (emailConfigUid = "") => {
    setStepLoading(true);

    if (stepIndex == 1) {
      //check for email config
      if (emailConfigUid) {
        setConfigUid(emailConfigUid);
        setStepIndex((prev: number) => prev - 1);
        setStepLoading(false);
        return;
      } else {
        setStepLoading(false);

        message.error("the email config is not selected or configured");
        return;
      }
    } else if (stepIndex > 0) {
      setStepIndex((prev: number) => prev - 1);
      setStepLoading(false);
      return;
    }
  };
  const handleContinue = async (emailConfigUid = "") => {
    setStepLoading(true);

    if (stepIndex == 0) {
      //check for email config
      if (emailConfigUid) {
        setConfigUid(emailConfigUid);
        setStepIndex((prev: number) => prev + 1);
        setStepLoading(false);
        return;
      } else {
        setStepLoading(false);

        message.error("The email config is not selected or configured");
        return;
      }
    } else if (stepIndex < 2) {
      setStepIndex((prev: number) => prev + 1);
      setStepLoading(false);
      return;
    } else if (stepIndex == 2) {
      setStepLoading(false);
      message.success("Email configuration completed successfully");
      navigate(`/module-configuration/emails/${survey_uid}`);
      return;
    }
  };

  const handleDismiss = (): void => {
    navigate(-1);
  };

  const fetchEmailConfigs = async () => {
    if (sctoForms?.length > 0) {
      const form_uid = sctoForms[0].form_uid;
      const configResponse = await dispatch(getEmailConfigs({ form_uid }));
      if (configResponse.payload?.success) {
        setconfigNames(configResponse.payload.data.data);
      }
    } else {
      message.error(
        "Cannot load email configs, kindly check that the form_uid is provided"
      );
      navigate(`/module-configuration/emails/${survey_uid}`);
    }
  };

  const fetchSCTOForms = async () => {
    const resp = (await getSCTOForms(survey_uid ?? "")) as any;
    if (resp?.data?.success) {
      setSctoForms(resp.data.data);
    } else {
      message.error("Failed to fetch surveyCTO forms");
    }
  };

  useEffect(() => {
    if (survey_uid) {
      fetchSCTOForms();
    }
  }, [survey_uid]);

  useEffect(() => {
    if (sctoForms?.length > 0) {
      fetchEmailConfigs();
    }
  }, [sctoForms]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <GlobalStyle />

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
                title: "Email Templates",
              },
              {
                title: "Email Schedules",
              },
            ]}
          />
        </div>
        <br />
        <div
          style={{
            height: "calc(100vh - 190px)",
            padding: "48px",
            margin: "auto",
          }}
        >
          {stepIndex === 0 ? (
            <EmailConfigForm
              handleContinue={handleContinue}
              configNames={configNames}
              sctoForms={sctoForms}
            />
          ) : null}
          {stepIndex === 1 ? (
            <EmailTemplateForm
              handleBack={handleBack}
              emailConfigUID={configUid}
              sctoForms={sctoForms}
              config={configNames}
              handleContinue={handleContinue}
            />
          ) : null}
          {stepIndex === 2 ? (
            <EmailScheduleForm
              handleBack={handleBack}
              emailConfigUID={configUid}
              configNames={configNames}
              handleContinue={handleContinue}
            />
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
