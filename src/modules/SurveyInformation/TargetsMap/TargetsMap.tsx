import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Col, Row, Select, message } from "antd";
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
  DescriptionText,
  TargetsMapFormWrapper,
  ErrorTable,
  HeadingText,
  OptionText,
  WarningTable,
} from "./TargetsMap.styled";
import { useEffect, useState } from "react";
import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import RowCountBox from "../../../components/RowCountBox";

interface CSVError {
  type: string;
  count: number;
  rows: string;
}
function TargetsMap() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const [hasError, setHasError] = useState<boolean>(false);
  const [errorList, setErrorList] = useState<CSVError[]>([]);
  const [hasWarning, setHasWarning] = useState<boolean>(false);
  const [warningList, setWarningList] = useState<CSVError[]>([]);
  const [customHeader, setCustomHeader] = useState<boolean>(false);
  const [customHeaderSelection, setCustomHeaderSelection] = useState<any>({});

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
      title: "Rows (in original csv) with error",
      dataIndex: "rows",
      key: "rows",
    },
  ];

  const warningTableColumn = [
    {
      title: "Warning type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Count of warning",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Rows (in original csv) with warning",
      dataIndex: "rows",
      key: "rows",
    },
  ];

  // Dummy data population, Remove it while integreation
  useEffect(() => {
    if (hasError) {
      setErrorList([
        {
          type: "Duplicate target ID",
          count: 14,
          rows: "2, 7, 9, 20, 39, 32, 48, 84, 128, 294",
        },
        {
          type: "Invalid PSU ID",
          count: 14,
          rows: "2, 7, 9, 20, 39, 32, 48, 84, 128, 294",
        },
        {
          type: "Missing mandatory field",
          count: 14,
          rows: "2, 7, 9, 20, 39, 32, 48, 84, 128, 294, 328, 364, 430, 543, 657, 789, 799",
        },
      ]);
    }
    if (hasWarning) {
      setWarningList([
        {
          type: "Blank cells",
          count: 20,
          rows: "2, 7, 9, 20, 39, 32, 48, 84, 128, 294",
        },
      ]);
    }
  }, []);

  // Note: If it is second time to upload targets
  // then fetch these feilds from last config to make
  // table data clumn uniform

  // Mandatory Field
  const mandatoryDetailsField = ["Target ID"];
  const locationDetailsField = ["PSU ID"];

  /**
   * These are the dummy values. Extract all values from CSV header
   * and store here
   */
  const csvHeaders = ["target_id", "psu_id"];

  /**
   * This should derrived values. Write a logic to exact the values
   * from csvHeaders variable whose has been used in dropdown.
   * So we will have only left over header
   */
  const extraCSVHeader = [
    "Target Name",
    "Target Address",
    "GPS",
    "State",
    "District",
  ];

  const csvHeaderOptions = csvHeaders.map((item, idx) => {
    return { label: item, value: item };
  });

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
        <TargetsMapFormWrapper>
          {!hasError && !hasWarning ? (
            <>
              <div>
                <Title>Targets: Map CSV columns</Title>
                <DescriptionText>
                  Select corresponding CSV column for the label on the left
                </DescriptionText>
              </div>
              <div>
                <HeadingText style={{ marginBottom: 22 }}>
                  Mandatory columns
                </HeadingText>
                {mandatoryDetailsField.map((item, idx) => {
                  return (
                    <Row key={idx}>
                      <Col span={3}>
                        <p>
                          <span style={{ color: "red" }}>*</span>{" "}
                          <OptionText>{item}:</OptionText>
                        </p>
                      </Col>
                      <Col
                        span={4}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Select
                          style={{ width: 180 }}
                          placeholder="Choose column"
                          options={csvHeaderOptions}
                        />
                      </Col>
                    </Row>
                  );
                })}
                <HeadingText>Location ID</HeadingText>
                {locationDetailsField.map((item, idx) => {
                  return (
                    <Row key={idx}>
                      <Col span={3}>
                        <p>
                          <span style={{ color: "red" }}>*</span>{" "}
                          <OptionText>{item}:</OptionText>
                        </p>
                      </Col>
                      <Col
                        span={4}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Select
                          style={{ width: 180 }}
                          placeholder="Choose column"
                          options={csvHeaderOptions}
                        />
                      </Col>
                    </Row>
                  );
                })}
                {customHeader ? (
                  <>
                    <p
                      style={{
                        color: "#434343",
                        fontFamily: "Inter",
                        fontSize: 12,
                        lineHeight: "20px",
                      }}
                    >
                      {extraCSVHeader.length} more columns found! Do you want to
                      keep them? Also, you can select if the column is mandatory
                      or not. You can also select if the column can be edited in
                      bulk.
                    </p>
                    <HeadingText>User selected columns</HeadingText>
                    {extraCSVHeader.map((item, idx) => {
                      return (
                        <Row key={idx}>
                          <Col span={3}>
                            <p>
                              <OptionText>{item}:</OptionText>
                            </p>
                          </Col>
                          <Col
                            span={4}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <div>
                              <Button
                                icon={
                                  customHeaderSelection[item] !== null &&
                                  customHeaderSelection[item] === true ? (
                                    <LikeFilled style={{ color: "green" }} />
                                  ) : (
                                    <LikeOutlined />
                                  )
                                }
                                style={{ borderRadius: 0 }}
                                onClick={() => {
                                  setCustomHeaderSelection((prev: any) => {
                                    return {
                                      ...prev,
                                      [item]: true,
                                    };
                                  });
                                }}
                              >
                                Keep
                              </Button>
                              <Button
                                icon={
                                  customHeaderSelection[item] !== null &&
                                  customHeaderSelection[item] === false ? (
                                    <DislikeFilled style={{ color: "red" }} />
                                  ) : (
                                    <DislikeOutlined />
                                  )
                                }
                                style={{ borderRadius: 0 }}
                                onClick={() => {
                                  setCustomHeaderSelection((prev: any) => {
                                    return {
                                      ...prev,
                                      [item]: false,
                                    };
                                  });
                                }}
                              >
                                Ignore
                              </Button>
                            </div>
                          </Col>
                          {customHeaderSelection[item] !== null &&
                          customHeaderSelection[item] === true ? (
                            <>
                              <Col
                                span={3}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginLeft: 30,
                                }}
                              >
                                <Checkbox>Is mandatory?</Checkbox>
                              </Col>
                              <Col
                                span={3}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginLeft: 30,
                                }}
                              >
                                <Checkbox>Bulk edit?</Checkbox>
                              </Col>
                              <Col
                                span={3}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginLeft: 30,
                                }}
                              >
                                <Checkbox>PII?</Checkbox>
                              </Col>
                            </>
                          ) : null}
                        </Row>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <Button
                      type="primary"
                      icon={<SelectOutlined />}
                      style={{ backgroundColor: "#2f54eB", marginTop: 10 }}
                      onClick={() => {
                        setCustomHeader(true);
                        // This is temp code to store custom header selection status
                        const temp: any = {};
                        extraCSVHeader.forEach((item: string, idx) => {
                          temp[item] = null;
                        });
                        setCustomHeaderSelection(temp);
                      }}
                    >
                      Map custom columns
                    </Button>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <Title>Targets</Title>
                <br />
                <RowCountBox
                  total={12000}
                  correct={11838}
                  error={42}
                  warning={20}
                />
                <DescriptionContainer>
                  <ol style={{ paddingLeft: "15px" }}>
                    <li>
                      <span style={{ fontWeight: 700 }}>Download</span>: A csv
                      is ready with all the error rows. Use the button below to
                      download the csv.
                    </li>
                    <li>
                      <span style={{ fontWeight: 700 }}>View errors</span>: The
                      table below has the list of all the errors and the
                      corresponding row numbers. The original row numbers are
                      present as a column in the csv. Use this to edit the csv.
                    </li>
                    <li>
                      <span style={{ fontWeight: 700 }}>
                        Correct and upload
                      </span>
                      : Once you are done with corrections, upload the csv
                      again.
                    </li>
                    <li>
                      <span style={{ fontWeight: 700 }}>Manage</span>: The final
                      list of targets is present in a table and that can also be
                      downloaded.
                    </li>
                  </ol>
                </DescriptionContainer>
              </div>
              {hasError ? (
                <div style={{ marginTop: 22 }}>
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
              {hasWarning ? (
                <div>
                  <p
                    style={{
                      fontFamily: "Inter",
                      fontSize: "14px",
                      fontWeight: "700",
                      lineHeight: "22px",
                    }}
                  >
                    Warnings table
                  </p>
                  <Row>
                    <Col span={23}>
                      <WarningTable
                        dataSource={warningList}
                        columns={warningTableColumn}
                        pagination={false}
                      />
                    </Col>
                  </Row>
                </div>
              ) : null}
              <div style={{ display: "flex" }}>
                <Button
                  type="primary"
                  icon={<CloudDownloadOutlined />}
                  style={{ backgroundColor: "#2f54eB" }}
                >
                  Download errors and warnings
                </Button>
                <Button
                  type="primary"
                  icon={<CloudUploadOutlined />}
                  style={{ marginLeft: 35, backgroundColor: "#2f54eB" }}
                >
                  Upload corrected CSV
                </Button>
              </div>
            </>
          )}
        </TargetsMapFormWrapper>
      </div>
      <FooterWrapper>
        <SaveButton>Save</SaveButton>
        <ContinueButton
          onClick={() =>
            // Add the logic while integeration to validation
            message.error("Map the mandatory columns before proceeding!")
          }
        >
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default TargetsMap;
