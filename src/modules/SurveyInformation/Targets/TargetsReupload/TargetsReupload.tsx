import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../../../redux/store";
import { Button, Col, Form, Row, message } from "antd";
import { Title } from "../../../../shared/Nav.styled";
import {
  DescriptionContainer,
  TargetReuploadFormWrapper,
  ErrorTable,
  Mandatory,
  StyledBreadcrumb,
} from "./TargetsReupload.styled";
import { CloseOutlined } from "@ant-design/icons";
import FileUpload from "./FileUpload";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  setTargetsBase64Data,
  setTargetsCSVColumns,
  setTargetsCSVRows,
  setTargetsFileUpload,
} from "../../../../redux/targets/targetSlice";
import { setLoading } from "../../../../redux/targets/targetSlice";
import { getSurveyCTOForm } from "../../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { GlobalStyle } from "../../../../shared/Global.styled";

interface CSVError {
  type: string;
  count: number;
  message: string;
}

interface ITargetsReupload {
  setScreenMode: Dispatch<SetStateAction<string>>;
}

function TargetsReupload({ setScreenMode }: ITargetsReupload) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };
  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };

  const [reupload, setReupload] = useState<boolean>(false);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorList, setErrorList] = useState<CSVError[]>([]);

  const targetsColumnMapping = useAppSelector(
    (state: RootState) => state.targets.targetsColumnMapping
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
    },
  ];

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
    setScreenMode("remap");
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
              `/survey-information/targets/${survey_uid}/${sctoForm?.payload[0]?.form_uid}`
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
      <TargetReuploadFormWrapper>
        {!reupload ? (
          <>
            <div style={{ display: "flex" }}>
              <Title>Add new targets</Title>
              <Button
                style={{
                  borderRadius: 2,
                  color: "#1D39C4",
                  marginLeft: "auto",
                  marginRight: 48,
                }}
                onClick={() => setScreenMode("manage")}
              >
                <CloseOutlined /> Cancel
              </Button>
            </div>
            <StyledBreadcrumb
              separator=">"
              items={[
                { title: "Upload csv", className: "active" },
                { title: "Map csv columns" },
                { title: "Update targets" },
              ]}
            />
            <DescriptionContainer>
              The following columns are existing in the enumerators table
              currently.
              {targetsColumnMapping !== null &&
                Object.keys(targetsColumnMapping).length > 0 && (
                  <ul>
                    {Object.keys(targetsColumnMapping).map(
                      (key) =>
                        key !== "custom_fields" && <li key={key}>{key}</li>
                    )}
                  </ul>
                )}
            </DescriptionContainer>
          </>
        ) : null}
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
      </TargetReuploadFormWrapper>
    </>
  );
}

export default TargetsReupload;
