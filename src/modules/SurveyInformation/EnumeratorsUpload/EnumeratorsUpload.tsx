import { useNavigate, useParams } from "react-router-dom";
import { Col, Form, Row } from "antd";
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
} from "../../../redux/enumerators/enumeratorsSlice";

interface CSVError {
  type: string;
  count: number;
  message: string[];
}
function EnumeratorsUpload() {
  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
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
    (state: RootState) => state.surveyLocations.loading
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
    base64Data: string
  ) => {
    // Access the file upload results
    console.log("File:", file);
    console.log("Column Names:", columnNames);
    dispatch(setEnumeratorCSVColumns(columnNames));
    dispatch(setEnumeratorFileUpload(true));
    dispatch(setEnumeratorBase64Data(base64Data));
    moveToMapping();
  };

  const moveToMapping = () => {
    navigate(`/survey-information/enumerators/map/${survey_uid}`);
  };

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
                <IconText>csv template</IconText>
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
                <IconText>Filled csv sample</IconText>
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
