import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { uploadCSVAssignments } from "../../../../redux/assignments/assignmentsActions";
import { ErrorBoundary } from "react-error-boundary";
import ErrorHandler from "../../../../components/ErrorHandler";
import { GlobalStyle, CustomBtn } from "../../../../shared/Global.styled";
import Container from "../../../../components/Layout/Container";
import { HeaderContainer, Title } from "../../../../shared/Nav.styled";
import FileUpload from "./FileUpload";
import { RootState } from "../../../../redux/store";
import {
  DescriptionContainer,
  ErrorTable,
  IconText,
} from "./UploadAssignments.styled";
import { Alert, Button, Col, message, Row } from "antd";
import EmailSchedule from "./EmailSchedule";
import { CSVLink } from "react-csv";
import { ProfileOutlined } from "@ant-design/icons";
import { WarningOutlined, CloseOutlined } from "@ant-design/icons";

interface CSVError {
  error_or_warning: string;
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

  // Error states
  const [hasError, setHasError] = useState<boolean>(false);
  const [hasRespError, setHasRespError] = useState<boolean>(false);
  const [errorList, setErrorList] = useState<CSVError[]>([]);
  const [csvErrorData, setCsvErrorData] = useState<any>(null);

  // File upload states
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [rowsCount, setRowsCount] = useState<number>(0);
  const [base64Data, setBase64Data] = useState<string>("");

  const [isAssignmentsDone, setIsAssignmentsDone] = useState<boolean>(false);
  const [assignmentStats, setAssignmentStats] = useState<any>({
    new_assignments_count: null,
    re_assignments_count: null,
    assignments_count: null,
    no_changes_count: null,
  });
  const [emailSchedule, setEmailSchedule] = useState<any>(null);

  const [enumIds, setEnumIds] = useState<string[]>([]);

  const handleFileUpload = (
    file: File,
    columnNames: string[],
    rows: string[],
    base64Data: string
  ) => {
    const enumColIdx = columnNames.indexOf("enumerator_id");
    if (enumColIdx !== -1) {
      const enumIds = rows.map((row) => row.split(",")[enumColIdx]);
      enumIds.shift();
      setEnumIds(Array.from(new Set(enumIds)));
    }
    setRowsCount(rows.length - 1);
    setBase64Data(base64Data);
  };

  const handleUploadBtnClick = (validate_mapping: boolean) => {
    if (form_uid && base64Data) {
      dispatch(
        uploadCSVAssignments({
          formUID: form_uid,
          fileData: base64Data,
          validate_mapping: validate_mapping,
        })
      ).then((response) => {
        if (response.payload.success) {
          message.success("Assignments uploaded successfully.");

          setAssignmentStats({
            new_assignments_count:
              response.payload.data["new_assignments_count"],
            re_assignments_count: response.payload.data["re_assignments_count"],
            assignments_count: response.payload.data["assignments_count"],
            no_changes_count: response.payload.data["no_changes_count"],
          });

          if (response.payload.data["email_schedule"]) {
            setEmailSchedule(response.payload.data["email_schedule"]);
          }

          setIsAssignmentsDone(true);
        } else {
          message.error("Failed to upload assignments.");
          if (response.payload?.errors) {
            const transformedErrors: CSVError[] = [];

            for (const errorKey in response.payload.errors) {
              let errorObj = response.payload.errors[errorKey];

              if (errorKey === "record_errors") {
                errorObj =
                  response.payload.errors[errorKey]["summary_by_error_type"];

                for (let i = 0; i < errorObj.length; i++) {
                  const summaryError: any = errorObj[i];

                  transformedErrors.push({
                    error_or_warning: summaryError["can_be_ignored"]
                      ? "warning"
                      : "error",
                    type: summaryError["error_type"]
                      ? summaryError["error_type"]
                      : errorKey,
                    count: summaryError["error_count"]
                      ? summaryError["error_count"]
                      : errorObj.length,
                    message: summaryError["error_message"]
                      ? summaryError["error_message"]
                      : errorObj,
                  });
                }
              } else {
                transformedErrors.push({
                  error_or_warning: errorObj["can_be_ignored"]
                    ? "warning"
                    : "error",
                  type: errorObj["error_type"]
                    ? errorObj["error_type"]
                    : errorKey,
                  count: errorObj.length,
                  message: errorObj,
                });
              }
            }

            setHasRespError(true);
            setErrorList(transformedErrors);
          }
        }
      });
    } else {
      message.error("Data is missing to make the request.");
    }
  };

  const errorTableColumn = [
    {
      title: "Error/ Warning",
      dataIndex: "error_or_warning",
      key: "error_or_warning",
      render: (error_or_warning: string) =>
        error_or_warning === "warning" ? (
          <div>
            <WarningOutlined
              style={{
                color: "#FAAD14",
                display: "inline-block",
              }}
            />
            <span style={{ marginLeft: "10px" }}>Warning</span>
          </div>
        ) : (
          <div>
            <CloseOutlined
              style={{
                color: "#F5222D",
                display: "inline-block",
              }}
            />
            <span style={{ marginLeft: "10px" }}>Error</span>
          </div>
        ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Count of errors",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Details",
      dataIndex: "message",
      key: "message",
      render: (message: any) => (
        <ul>
          {Array.isArray(message) ? (
            message?.map((msg, index) => <li key={index}>{msg}</li>)
          ) : (
            <li>{message}</li>
          )}
        </ul>
      ),
    },
  ];

  useEffect(() => {
    if (errorList.length > 0) {
      const errors = errorList.map((error) => {
        return {
          error_or_warning: error.error_or_warning,
          type: error.type,
          count: error.count,
          rows: error.message,
        };
      });
      setCsvErrorData(errors);
    }
  }, [errorList]);

  const isLoading = assignmentsLoading;

  return (
    <>
      <GlobalStyle />
      <>
        {isLoading ? (
          <FullScreenLoader />
        ) : (
          <>
            <Container surveyPage={true} />
            <HeaderContainer>
              <Title>Upload assignments</Title>
            </HeaderContainer>
            {isAssignmentsDone ? (
              <div style={{ margin: 36 }}>
                <p
                  style={{
                    color: "#434343",
                    fontFamily: "Lato",
                    lineHeight: "24px",
                    fontWeight: 500,
                    marginBottom: 0,
                  }}
                >
                  Summary of assignments to surveyors:
                </p>
                <div style={{ display: "flex" }}>
                  <div>
                    <p
                      style={{
                        color: "#434343",
                        fontFamily: "Lato",
                        fontSize: "16px",
                        lineHeight: "24px",
                      }}
                    >
                      New assignments
                    </p>
                    <p>{assignmentStats.new_assignments_count}</p>
                  </div>
                  <div style={{ marginLeft: 80 }}>
                    <p
                      style={{
                        color: "#434343",
                        fontFamily: "Lato",
                        fontSize: "16px",
                        lineHeight: "24px",
                      }}
                    >
                      Reassignments
                    </p>
                    <p>{assignmentStats.re_assignments_count}</p>
                  </div>
                  <div style={{ marginLeft: 80 }}>
                    <p
                      style={{
                        color: "#434343",
                        fontFamily: "Lato",
                        fontSize: "16px",
                        lineHeight: "24px",
                      }}
                    >
                      Total Assignments
                    </p>
                    <p>{assignmentStats.assignments_count}</p>
                  </div>
                </div>
                {assignmentStats.assignments_count ===
                assignmentStats.no_changes_count ? (
                  // no changes effected
                  <>
                    <Alert
                      closable={false}
                      style={{
                        color: "#434343",
                        fontFamily: "Lato",
                        fontSize: "14px",
                        lineHeight: "24px",
                        marginTop: "36px",
                        marginBottom: "36px",
                      }}
                      message="No changes to assignments"
                      description="No adjustments have been made to the assignments. It's likely that the surveyors were assigned to 
                    the same targets as before. To make changes, please go through the assignments flow again."
                      type="warning"
                      showIcon
                    />
                    <Button
                      type="primary"
                      style={{ backgroundColor: "#597EF7", color: "white" }}
                      onClick={() =>
                        navigate(
                          `/module-configuration/assignments/${survey_uid}/${form_uid}`
                        )
                      }
                    >
                      Done
                    </Button>
                  </>
                ) : (
                  <EmailSchedule
                    emailSchedule={emailSchedule}
                    surveyUID={survey_uid}
                    formUID={form_uid}
                    enumIds={enumIds}
                  />
                )}
              </div>
            ) : (
              <div style={{ margin: 36 }}>
                {fileUploaded && !hasError ? (
                  <>
                    {!hasRespError ? (
                      <>
                        <DescriptionContainer>
                          {rowsCount} assignments found in CSV. Are you sure to
                          upload them?
                        </DescriptionContainer>
                        <Button
                          type="default"
                          style={{ marginTop: 20 }}
                          onClick={() => navigate(-1)}
                        >
                          Cancel
                        </Button>
                        <CustomBtn
                          style={{ marginLeft: 20, marginTop: 20 }}
                          onClick={() => handleUploadBtnClick(true)}
                        >
                          Upload assignments
                        </CustomBtn>
                      </>
                    ) : (
                      <div style={{ marginTop: "32px" }}>
                        <p
                          style={{
                            fontFamily: "Lato",
                            fontSize: "14px",
                            fontWeight: "700",
                            lineHeight: "22px",
                          }}
                        >
                          Errors and warnings table
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
                        <Button style={{ marginRight: 16 }}>
                          <CSVLink
                            data={csvErrorData ?? ""}
                            filename={"assignments-error.csv"}
                          >
                            Download errors and warnings
                          </CSVLink>
                        </Button>
                        {
                          // Add a Continue button if there are no errors only warnings
                          errorList.every(
                            (error) => error.error_or_warning === "warning"
                          ) && (
                            <Button
                              style={{
                                marginRight: 16,
                              }}
                              onClick={() => handleUploadBtnClick(false)}
                            >
                              Continue upload
                            </Button>
                          )
                        }
                        <Button
                          style={{
                            backgroundColor: "#597EF7",
                            color: "white",
                            marginRight: 16,
                          }}
                          onClick={() => navigate(0)}
                        >
                          Upload corrected CSV
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div style={{ display: "flex", marginBottom: 24 }}>
                      <div
                        style={{
                          display: "flex",
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
                      Upload assignments data in csv format.
                      <ul style={{ marginBottom: 24 }}>
                        <li>
                          Please go through the template and filled csv sheet
                          before uploading
                        </li>
                        <li>
                          Mandatory csv columns are: <b>target_id</b> and{" "}
                          <b>enumerator_id</b>
                        </li>
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
                    <Button
                      type="default"
                      style={{ marginTop: 20 }}
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
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
                        <Button>
                          <CSVLink
                            data={csvErrorData ?? ""}
                            filename={"assignments-error.csv"}
                          >
                            Download errors and warnings
                          </CSVLink>
                        </Button>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            )}
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
