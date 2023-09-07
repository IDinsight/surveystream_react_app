import { useNavigate, useParams } from "react-router-dom";
import { Col, Form, Row, message } from "antd";
import Header from "../../../components/Header";
import {
  BackArrow,
  BackLink,
  NavWrapper,
  Title,
} from "../../../shared/Nav.styled";
import SideMenu from "../SideMenu";
import {
  ContinueButton,
  FooterWrapper,
  SaveButton,
} from "../../../shared/FooterBar.styled";
import {
  DescriptionContainer,
  EnumeratorsUploadFormWrapper,
  ErrorTable,
} from "./EnumeratorsUpload.styled";
import { ProfileOutlined } from "@ant-design/icons";
import { IconText } from "../SurveyLocationUpload/SurveyLocationUpload.styled";
import FileUpload from "./FileUpload";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";

import { RootState } from "../../../redux/store";
import {
  setEnumeratorBase64Data,
  setEnumeratorCSVColumns,
  setEnumeratorFileUpload,
  setEnumeratorCSVRows,
  setLoading,
} from "../../../redux/enumerators/enumeratorsSlice";
import { getSurveyCTOForm } from "../../../redux/surveyCTOInformation/surveyCTOInformationActions";

interface CSVError {
  type: string;
  count: number;
  message: string[];
}
function EnumeratorsUpload() {
  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };
  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const [form] = Form.useForm();

  const [hasError, setHasError] = useState<boolean>(false);
  const [errorList, setErrorList] = useState<CSVError[]>([]);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const isLoading = useAppSelector(
    (state: RootState) => state.enumerators.loading
  );

  const errorTableColumn = [
    {
      title: "Error type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Count of errors",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Error message",
      dataIndex: "message",
      key: "message",
      render: (message: string[]) => (
        <ul>
          {message.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      ),
    },
  ];

  const handleFileUpload = (
    file: File,
    columnNames: string[],
    rows: string[],
    base64Data: string
  ) => {
    // Access the file upload results
    console.log("File:", file);
    console.log("Column Names:", columnNames);
    console.log("rows:", rows);

    dispatch(setEnumeratorCSVColumns(columnNames));
    dispatch(setEnumeratorCSVRows(rows));
    dispatch(setEnumeratorFileUpload(true));
    dispatch(setEnumeratorBase64Data(base64Data));
    moveToMapping();
  };

  const moveToMapping = () => {
    navigate(`/survey-information/enumerators/map/${survey_uid}/${form_uid}`);
  };

  useEffect(() => {
    const handleFormUID = async () => {
      if (form_uid == "" || form_uid == undefined) {
        try {
          dispatch(setLoading(true));
          const sctoForm = await dispatch(
            getSurveyCTOForm({ survey_uid: survey_uid })
          );
          if (sctoForm?.payload[0]?.form_uid) {
            navigate(
              `/survey-information/enumerators/upload/${survey_uid}/${sctoForm?.payload[0]?.form_uid}`
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
      <Header />
      <NavWrapper>
        <BackLink onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title> {activeSurvey?.survey_name} </Title>
      </NavWrapper>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu />
          <EnumeratorsUploadFormWrapper>
            <div style={{ display: "flex" }}>
              <Title>Enumerators: Upload csv</Title>
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
                      "https://docs.google.com/spreadsheets/d/1vkvS-r9etZCb5L0Uazr_rO6sE_ZOpVIyYynreiG8Ko8",
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
                      "https://docs.google.com/spreadsheets/d/1-Xuod1xh_hOkovuvIli6wnmR5P7dV7s7Agd46aVaYrE",
                      "__blank"
                    )
                  }
                >
                  Filled csv sample
                </IconText>
              </div>
            </div>
            <DescriptionContainer>
              <ol style={{ paddingLeft: "15px" }}>
                <li>
                  Upload enumerators data in csv format. Please go through the
                  template and filled csv sheet before uploading.
                </li>
                <li>
                  Mandatory csv fields:
                  <ol type="a">
                    <li>Enumerator ID</li>
                    <li>Enumerator Name</li>
                    <li>Email ID</li>
                    <li>Mobile (primary)</li>
                    <li>Gender</li>
                    <li>Enumerator type</li>
                    <li>Location ID</li>
                    <li>
                      Prime-Geo Location (If location is selected as a mapping
                      criterion).
                    </li>
                    <li>
                      Language (If language is selected as a mapping criterion).
                    </li>
                  </ol>
                </li>
                <li>
                  You can also add custom columns are per the requirement of
                  your survey - please ensure the column(s) is added in the csv
                  file you will upload.
                </li>
                <li>
                  You can edit the enumerator data before and during (certain
                  fields) data collection.
                </li>
                <li>
                  You can add more enumerators before and during data
                  collection.
                </li>
              </ol>
            </DescriptionContainer>
            <div style={{ marginTop: "10px", marginBottom: "14px" }}>
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
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontWeight: "700",
                    lineHeight: "22px",
                  }}
                >
                  Errors table
                </p>
                <Row>
                  <Col span={23}>
                    <ErrorTable
                      dataSource={errorList}
                      columns={errorTableColumn}
                      pagination={false}
                    />
                  </Col>
                </Row>
              </div>
            ) : null}
          </EnumeratorsUploadFormWrapper>
        </div>
      )}
      <FooterWrapper>
        <SaveButton disabled>Save</SaveButton>
        <ContinueButton disabled={!fileUploaded} onClick={moveToMapping}>
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default EnumeratorsUpload;
