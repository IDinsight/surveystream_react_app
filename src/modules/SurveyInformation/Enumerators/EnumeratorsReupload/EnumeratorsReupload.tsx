import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, Button, Col, Form, Row, message } from "antd";
import { Title } from "../../../../shared/Nav.styled";
import {
  DescriptionContainer,
  EnumeratorsReuploadFormWrapper,
  ErrorTable,
  Mandatory,
  StyledBreadcrumb,
} from "./EnumeratorsReupload.styled";
import { CloseOutlined, ProfileOutlined } from "@ant-design/icons";
import { IconText } from "../../SurveyLocationUpload/SurveyLocationUpload.styled";
import FileUpload from "./FileUpload";
import { Dispatch, SetStateAction, useState } from "react";
import { useAppDispatch } from "../../../../redux/hooks";

import {
  setEnumeratorBase64Data,
  setEnumeratorCSVColumns,
  setEnumeratorFileUpload,
  setEnumeratorCSVRows,
  setLoading,
} from "../../../../redux/enumerators/enumeratorsSlice";

interface CSVError {
  type: string;
  count: number;
  message: string[];
}

interface IEnumeratorsReupload {
  setScreenMode: Dispatch<SetStateAction<string>>;
}

function EnumeratorsReupload({ setScreenMode }: IEnumeratorsReupload) {
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorList, setErrorList] = useState<CSVError[]>([]);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const dispatch = useAppDispatch();

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
    // TODO: Check any integration issues
    dispatch(setEnumeratorCSVColumns(columnNames));
    dispatch(setEnumeratorCSVRows(rows));
    dispatch(setEnumeratorFileUpload(true));
    dispatch(setEnumeratorBase64Data(base64Data));
    moveToMapping();
  };

  const moveToMapping = () => {
    setScreenMode("remap");
  };

  return (
    <EnumeratorsReuploadFormWrapper>
      <div style={{ display: "flex" }}>
        <Title>Add new enumerators</Title>
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
          { title: "Update enumerators" },
        ]}
      />
      <DescriptionContainer>
        The following columns are existing in the enumerators table currently.
        The mandatory columns are indicated with a <Mandatory>*</Mandatory>:
        <ol type="a">
          <li>
            Enumerator ID <Mandatory>*</Mandatory>
          </li>
          <li>
            Enumerator Name <Mandatory>*</Mandatory>
          </li>
          <li>
            Email ID <Mandatory>*</Mandatory>
          </li>
          <li>
            Mobile (primary) <Mandatory>*</Mandatory>
          </li>
          <li>
            Language <Mandatory>*</Mandatory>
          </li>
          <li>
            Address <Mandatory>*</Mandatory>
          </li>
          <li>
            Gender <Mandatory>*</Mandatory>
          </li>
          <li>
            State <Mandatory>*</Mandatory>
          </li>
          <li>
            District <Mandatory>*</Mandatory>
          </li>
          <li>
            Block <Mandatory>*</Mandatory>
          </li>
          <li>
            State ID <Mandatory>*</Mandatory>
          </li>
          <li>
            District ID <Mandatory>*</Mandatory>
          </li>
          <li>
            Block ID <Mandatory>*</Mandatory>
          </li>
          <li>
            Employment status <Mandatory>*</Mandatory>
          </li>
          <li>IDi experience</li>
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
    </EnumeratorsReuploadFormWrapper>
  );
}

export default EnumeratorsReupload;
