import { useNavigate, useParams } from "react-router-dom";
import { Col, Form, Row, message } from "antd";

import { HeaderContainer, Title } from "../../../../shared/Nav.styled";
import SideMenu from "../../SideMenu";
import {
  ContinueButton,
  FooterWrapper,
  SaveButton,
} from "../../../../shared/FooterBar.styled";
import {
  DescriptionContainer,
  TargetUploadFormWrapper,
} from "./TargetsUpload.styled";
import { ProfileOutlined, SelectOutlined } from "@ant-design/icons";
import { IconText } from "../../SurveyLocationUpload/SurveyLocationUpload.styled";
import FileUpload from "./FileUpload";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import {
  setTargetsBase64Data,
  setTargetsCSVColumns,
  setTargetsCSVRows,
  setTargetsFileUpload,
} from "../../../../redux/targets/targetSlice";
import { setLoading } from "../../../../redux/targets/targetSlice";
import { getSurveyCTOForm } from "../../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { GlobalStyle } from "../../../../shared/Global.styled";
import Container from "../../../../components/Layout/Container";
import ErrorWarningTable from "../../../../components/ErrorWarningTable";

interface CSVError {
  type: string;
  count: number;
  message: string;
}
function TargetsUpload() {
  const navigate = useNavigate();

  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };
  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };

  const [form] = Form.useForm();

  const [reupload, setReupload] = useState<boolean>(false);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorList, setErrorList] = useState<CSVError[]>([]);

  const dispatch = useAppDispatch();

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const isLoading = useAppSelector((state: RootState) => state.targets.loading);
  const { loading: isSideMenuLoading } = useAppSelector(
    (state: RootState) => state.surveyConfig
  );

  const handleFileUpload = (
    file: File,
    columnNames: string[],
    rows: string[],
    base64Data: string
  ) => {
    dispatch(setTargetsCSVColumns(columnNames));
    dispatch(setTargetsCSVRows(rows));
    dispatch(setTargetsFileUpload(true));
    dispatch(setTargetsBase64Data(base64Data));
    moveToMapping();
  };

  const moveToMapping = () => {
    navigate(`/survey-information/targets/map/${survey_uid}/${form_uid}`);
  };

  useEffect(() => {
    const handleFormUID = async () => {
      if (form_uid == "" || form_uid == undefined || form_uid == "undefined") {
        try {
          dispatch(setLoading(true));
          const sctoForm = await dispatch(
            getSurveyCTOForm({ survey_uid: survey_uid })
          );
          if (sctoForm?.payload[0]?.form_uid) {
            navigate(
              `/survey-information/targets/upload/${survey_uid}/${sctoForm?.payload[0]?.form_uid}`
            );
          } else {
            message.error("Kindly configure SCTO Form to proceed");
            navigate(
              `/survey-information/survey-cto-information/${survey_uid}`
            );
          }
          dispatch(setLoading(false));
        } catch (error) {
          dispatch(setLoading(false));
          console.log("Error fetching sctoForm:", error);
        }
      }
    };

    handleFormUID();
  }, []);

  return (
    <>
      <GlobalStyle />

      <Container surveyPage={true} />
      <HeaderContainer>
        <Title>Targets: Upload CSV</Title>
      </HeaderContainer>
      {isLoading || isSideMenuLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu />
          <TargetUploadFormWrapper>
            {!reupload ? (
              <>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      display: "flex",
                      marginLeft: "auto",
                      color: "#2F54EB",
                    }}
                  >
                    <ProfileOutlined style={{ fontSize: "24px" }} />
                    <IconText
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(
                          "https://drive.google.com/drive/folders/1MJzj2z3d2xIxJekONuyOpkQnkdBorfXP?usp=sharing",
                          "__blank"
                        )
                      }
                    >
                      csv template
                    </IconText>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginRight: "55px",
                      marginLeft: "32px",
                      color: "#2F54EB",
                    }}
                  >
                    <ProfileOutlined style={{ fontSize: "24px" }} />
                    <IconText
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(
                          "https://drive.google.com/drive/folders/1MJzj2z3d2xIxJekONuyOpkQnkdBorfXP?usp=sharing",
                          "__blank"
                        )
                      }
                    >
                      Filled csv sample
                    </IconText>
                  </div>
                </div>
                <DescriptionContainer>
                  Upload a .csv file containing the targets for your survey.{" "}
                  <a
                    href="https://docs.surveystream.idinsight.io/targets#targets"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#2F80ED",
                      fontSize: "14px",
                      fontFamily: '"Lato", sans-serif',
                    }}
                  >
                    Learn more
                    <SelectOutlined
                      rotate={90}
                      style={{
                        marginLeft: "3px",
                        padding: "0px",
                        fontSize: "15px",
                      }}
                    />{" "}
                  </a>{" "}
                </DescriptionContainer>
              </>
            ) : null}
            <div style={{ marginTop: "20px", marginBottom: "14px" }}>
              <Form layout="horizontal">
                <Row>
                  <Col span={23}>
                    <FileUpload
                      style={{ height: "274px" }}
                      setUploadStatus={setFileUploaded}
                      onFileUpload={handleFileUpload}
                      hasError={hasError}
                      setHasError={setHasError}
                      setErrorList={setErrorList}
                    />
                  </Col>
                </Row>
              </Form>
            </div>
            {hasError ? (
              <div style={{ marginTop: "32px" }}>
                <p
                  style={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                    fontWeight: "700",
                    lineHeight: "22px",
                  }}
                >
                  Errors table
                </p>
                <ErrorWarningTable
                  errorList={errorList}
                  showErrorTable={true}
                  showWarningTable={false}
                />
              </div>
            ) : null}
          </TargetUploadFormWrapper>
        </div>
      )}
    </>
  );
}

export default TargetsUpload;
