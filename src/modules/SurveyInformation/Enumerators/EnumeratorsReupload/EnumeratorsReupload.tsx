import { Button, Col, Form, Row } from "antd";
import { Title } from "../../../../shared/Nav.styled";
import {
  DescriptionContainer,
  EnumeratorsReuploadFormWrapper,
  ErrorTable,
  StyledBreadcrumb,
} from "./EnumeratorsReupload.styled";
import { CloseOutlined, SelectOutlined } from "@ant-design/icons";
import FileUpload from "./FileUpload";
import { Dispatch, SetStateAction, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

import {
  setEnumeratorBase64Data,
  setEnumeratorCSVColumns,
  setEnumeratorFileUpload,
  setEnumeratorCSVRows,
} from "../../../../redux/enumerators/enumeratorsSlice";
import { RootState } from "../../../../redux/store";
import { GlobalStyle } from "../../../../shared/Global.styled";

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

  const enumeratorColumnMapping = useAppSelector(
    (state: RootState) => state.enumerators.enumeratorColumnMapping
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
    <>
      <GlobalStyle />
      <EnumeratorsReuploadFormWrapper>
        <div style={{ display: "flex" }}>
          <Button
            style={{
              marginLeft: "auto",
              marginRight: 48,
            }}
            onClick={() => setScreenMode("manage")}
          >
            <CloseOutlined /> Cancel
          </Button>
        </div>
        <DescriptionContainer>
          Upload a .csv file containing the enumerators for your survey.{" "}
          <a
            href="https://docs.surveystream.idinsight.io/enumerators#enumerators"
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
      </EnumeratorsReuploadFormWrapper>
    </>
  );
}

export default EnumeratorsReupload;
