import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Col, Row, Select } from "antd";
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
  EnumeratorsMapFormWrapper,
  ErrorTable,
  HeadingText,
  OptionText,
} from "./EnumeratorsMap.styled";
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
function EnumeratorsMap() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const [hasError, setHasError] = useState<boolean>(false);
  const [errorList, setErrorList] = useState<CSVError[]>([]);
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

  // Dummy data population, Remove it while integreation
  useEffect(() => {
    if (hasError) {
      setErrorList([
        {
          type: "Invalid email ID",
          count: 12,
          rows: "2, 7, 9, 20, 39, 32, 48, 84, 128, 294",
        },
        {
          type: "Invalid mobile no",
          count: 12,
          rows: "2, 7, 9, 20, 39, 32, 48, 84, 128, 294",
        },
        {
          type: "Duplicate enumerator ID",
          count: 12,
          rows: "2, 7, 9, 20, 39, 32, 48, 84, 128, 294, 328, 364, 430, 543, 657, 789, 799",
        },
        {
          type: "Duplicate email ID",
          count: 12,
          rows: "2, 7, 9, 20, 39, 32, 48, 84, 128, 294",
        },
        {
          type: "Invalid location ‘State’",
          count: 12,
          rows: "2, 7, 9, 20, 39, 32, 48, 84, 128, 294.",
        },
        {
          type: "Invalid location ‘Block’",
          count: 12,
          rows: "2, 7, 9, 20, 39, 32, 48, 84, 128, 294",
        },
      ]);
    }
  }, []);

  // Mandatory Field
  const personalDetailsField = [
    "Enumerator ID",
    "Enumerator Name",
    "Email ID",
    "Mobile (primary)",
    "Language (p)",
    "Address",
    "Gender",
    "Enumerator type",
  ];
  const locationDetailsField = ["State", "District", "Block"];

  /**
   * These are the dummy values. Extract all values from CSV header
   * and store here
   */
  const csvHeaders = [
    "Surveyor ID",
    "Enumerator name",
    "email",
    "Mobile number",
    "Primary language",
    "Surveyor address",
    "Gender",
    "enum_type",
    "State name",
    "District name",
    "Block name",
    "State ID",
    "District ID",
    "Block ID",
  ];

  /**
   * This should derrived values. Write a logic to exact the values
   * from csvHeaders variable whose has been used in dropdown.
   * So we will have only left over header
   */
  const extraCSVHeader = [
    "Mobile no. (s)",
    "Employment status",
    "Secondary language",
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
        <EnumeratorsMapFormWrapper>
          {!hasError ? (
            <>
              <div>
                <Title>Enumerators: Map CSV columns</Title>
                <DescriptionText>
                  Select corresponding CSV column for the label on the left
                </DescriptionText>
              </div>
              <div>
                <HeadingText style={{ marginBottom: 22 }}>
                  Mandatory columns
                </HeadingText>
                <HeadingText>Personal Details and contact</HeadingText>
                {personalDetailsField.map((item, idx) => {
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
                      <Col
                        span={3}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: 30,
                        }}
                      >
                        <Checkbox>Bulk changes</Checkbox>
                      </Col>
                    </Row>
                  );
                })}
                <HeadingText>Location Details</HeadingText>
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
                      <Col
                        span={3}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: 30,
                        }}
                      >
                        <Checkbox>Bulk changes</Checkbox>
                      </Col>
                    </Row>
                  );
                })}
                <HeadingText>Location ID</HeadingText>
                <Row>
                  <Col span={3}>
                    <p>
                      <span style={{ color: "red" }}>*</span>{" "}
                      <OptionText>Prime geo location:</OptionText>
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
                  <Col
                    span={3}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 30,
                    }}
                  >
                    <Checkbox>
                      <OptionText>Bulk changes</OptionText>
                    </Checkbox>
                  </Col>
                </Row>
                {customHeader ? (
                  <>
                    <HeadingText>Custom columns</HeadingText>
                    <p
                      style={{
                        color: "#434343",
                        fontFamily: "Inter",
                        fontSize: 12,
                        lineHeight: "20px",
                      }}
                    >
                      {extraCSVHeader.length} custom columns found!
                    </p>
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
                          <Col
                            span={3}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginLeft: 30,
                            }}
                          >
                            <Checkbox>
                              <OptionText>Bulk changes</OptionText>
                            </Checkbox>
                          </Col>
                        </Row>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <HeadingText>
                      Want to map more columns, which are custom to your survey
                      and present in the csv? Click on the button below after
                      mapping the mandatory columns!
                    </HeadingText>
                    <Button
                      type="primary"
                      icon={<SelectOutlined />}
                      style={{ backgroundColor: "#2f54eB" }}
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
                <Title>Enumerators</Title>
                <br />
                <RowCountBox />
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
                      list of enumerators is present in a table and that can
                      also be downloaded.
                    </li>
                  </ol>
                </DescriptionContainer>
              </div>
              <div style={{ marginTop: 22 }}>
                <p
                  style={{
                    fontFamily: "Inter",
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
              </div>
              <div style={{ display: "flex" }}>
                <Button
                  type="primary"
                  icon={<CloudDownloadOutlined />}
                  style={{ backgroundColor: "#2f54eB" }}
                >
                  Download erroneous rows
                </Button>
                <Button
                  type="primary"
                  icon={<CloudUploadOutlined />}
                  style={{ marginLeft: 35, backgroundColor: "#2f54eB" }}
                >
                  Upload CSV again
                </Button>
              </div>
            </>
          )}
        </EnumeratorsMapFormWrapper>
      </div>
      <FooterWrapper>
        <SaveButton>Save</SaveButton>
        <ContinueButton>Continue</ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default EnumeratorsMap;
