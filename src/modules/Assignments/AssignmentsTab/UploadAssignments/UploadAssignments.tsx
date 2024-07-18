import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import Header from "../../../../components/Header";
import NavItems from "../../../../components/NavItems";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { uploadCSVAssignments } from "../../../../redux/assignments/assignmentsActions";
import { ErrorBoundary } from "react-error-boundary";
import ErrorHandler from "../../../../components/ErrorHandler";
import { GlobalStyle } from "../../../../shared/Global.styled";
import Container from "../../../../components/Layout/Container";
import { HeaderContainer, Title } from "../../../../shared/Nav.styled";
import FileUpload from "./FileUpload";
import { RootState } from "../../../../redux/store";
import { DescriptionContainer, ErrorTable } from "./UploadAssignments.styled";
import { Button, Col, message, Row } from "antd";

interface CSVError {
  type: string;
  count: number;
  message: string[];
}

function UploadAssignments() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid, form_uid } = useParams<{
    survey_uid: string;
    form_uid: string;
  }>();

  const { loading: assignmentsLoading } = useAppSelector(
    (state: RootState) => state.assignments.assignments
  );

  const [hasError, setHasError] = useState<boolean>(false);
  const [errorList, setErrorList] = useState<CSVError[]>([]);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [rowsCount, setRowsCount] = useState<number>(0);
  const [base64Data, setBase64Data] = useState<string>("");

  const handleFileUpload = (
    file: File,
    columnNames: string[],
    rows: string[],
    base64Data: string
  ) => {
    setRowsCount(rows.length - 1);
    setBase64Data(base64Data);
  };

  const handleUploadBtnClick = () => {
    if (form_uid && base64Data) {
      dispatch(
        uploadCSVAssignments({ formUID: form_uid, fileData: base64Data })
      ).then((response) => {
        console.log("response", response);
        if (response.payload.success) {
          message.success("Assignments uploaded successfully.");
          navigate(
            `/module-configuration/assignments/${survey_uid}/${form_uid}`
          );
        } else {
          message.error("Failed to upload assignments.");
        }
      });
    } else {
      message.error("Data is missing to make the request.");
    }
  };

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
          {message?.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      ),
    },
  ];

  const isLoading = assignmentsLoading;

  return (
    <>
      <GlobalStyle />
      <>
        <Header items={NavItems} />
        {isLoading ? (
          <FullScreenLoader />
        ) : (
          <>
            <Container />
            <HeaderContainer>
              <Title>Upload assignments</Title>
            </HeaderContainer>
            <div style={{ margin: 36 }}>
              {fileUploaded && !hasError ? (
                <div>
                  <DescriptionContainer>
                    {rowsCount} assignments found in CSV. Are you sure to upload
                    them?
                  </DescriptionContainer>
                  <Button type="primary" onClick={handleUploadBtnClick}>
                    Upload assignments
                  </Button>
                  <Button
                    type="default"
                    onClick={() => navigate(0)}
                    style={{ marginLeft: 24 }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <DescriptionContainer>
                    <ul style={{ marginBottom: 24 }}>
                      <li>
                        Upload assignments data in csv format. Please go through
                        the template and filled csv sheet before uploading.
                      </li>
                      <li>Mandatory csv fields: Target ID and Enumerator ID</li>
                    </ul>
                  </DescriptionContainer>
                  <FileUpload
                    style={{ height: "274px" }}
                    setUploadStatus={setFileUploaded}
                    onFileUpload={handleFileUpload}
                    hasError={hasError}
                    setHasError={setHasError}
                    setErrorList={setErrorList}
                  />
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
                </>
              )}
            </div>
          </>
        )}
      </>
    </>
  );
}

function UploadAssignmentsWithErrorBoundary() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler}>
      <UploadAssignments />
    </ErrorBoundary>
  );
}

export default UploadAssignmentsWithErrorBoundary;
