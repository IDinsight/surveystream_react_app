import { useNavigate } from "react-router-dom";
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

interface CSVError {
  type: string;
  count: number;
  message: string;
}
function EnumeratorsUpload() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const [form] = Form.useForm();

  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorList, setErrorList] = useState<CSVError[]>([]);

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
    },
  ];

  const handleFileUpload = (file: File) => {
    // Access the file upload results
    console.log("File:", file);
  };

  // Dummy data population, Remove it while integreation
  useEffect(() => {
    if (hasError) {
      setErrorList([
        {
          type: "Column names not found",
          count: 4,
          message:
            "Column names for columns 4,8,10,12 were not found. Ensure first row contains column names.",
        },
        {
          type: "Duplicate rows",
          count: 4,
          message:
            "Duplicate rows are not allowed. The rows 2, 7, 9, 20 are duplicates.",
        },
        {
          type: "Duplicate column names",
          count: 3,
          message:
            "Duplicate column names are not allowed. Columns 5,6,7 have duplicate column names",
        },
        {
          type: "Blank fields",
          count: 20,
          message:
            "Blank fields are not allowed. The following rows have blank names: 3,4,6",
        },
        {
          type: "Blank rows",
          count: 12,
          message: "2, 7, 9, 20, 39, 32, 48, 84, 128, 294.",
        },
        {
          type: "Mandatory columns missing",
          count: 3,
          message:
            "There are 14 mandatory columns, but only 11 columns were found in the csv.",
        },
      ]);
    }
  }, []);
  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title> TSDPS </Title>
      </NavWrapper>
      <div style={{ display: "flex" }}>
        <SideMenu />
        <EnumeratorsUploadFormWrapper>
          <div style={{ display: "flex" }}>
            <Title>Enumerators: Upload csv</Title>
            <div
              style={{ display: "flex", marginLeft: "auto", color: "#2F54EB" }}
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
                  <li>Language</li>
                  <li>Address</li>
                  <li>Gender</li>
                  <li>Enumerator type</li>
                  <li>
                    Location labels (as provided in the Survey location step ex:
                    state, district, block).
                  </li>
                  <li>
                    Location ID (as provided in the Survey location step ex:
                    state ID, district ID, block ID)
                  </li>
                </ol>
              </li>
              <li>
                You can also add custom columns are per the requirement of your
                survey - please ensure the column(s) is added in the csv file
                you will upload.
              </li>
              <li>
                You can edit the enumerator data before and during (certain
                fields) data collection.
              </li>
              <li>
                You can add more enumerators before and during data collection.
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
      <FooterWrapper>
        <SaveButton>Save</SaveButton>
        <ContinueButton>Continue</ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default EnumeratorsUpload;
