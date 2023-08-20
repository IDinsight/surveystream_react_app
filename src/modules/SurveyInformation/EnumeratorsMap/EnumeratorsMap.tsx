import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, Col, Form, Row, Select, message } from "antd";
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
import { RootState } from "../../../redux/store";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { postEnumeratorsMapping } from "../../../redux/enumerators/enumeratorsActions";

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

  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };
  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };
  const [enumeratorMappingForm] = Form.useForm();
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorList, setErrorList] = useState<CSVError[]>([]);
  const [customHeader, setCustomHeader] = useState<boolean>(false);
  const [customHeaderSelection, setCustomHeaderSelection] = useState<any>({});
  const dispatch = useAppDispatch();

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const isLoading = useAppSelector(
    (state: RootState) => state.enumerators.loading
  );

  const csvHeaders = useAppSelector(
    (state: RootState) => state.enumerators.csvColumnNames
  );

  const csvBase64Data = useAppSelector(
    (state: RootState) => state.enumerators.csvBase64Data
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
      title: "Rows (in original csv) with error",
      dataIndex: "rows",
      key: "rows",
    },
  ];

  // Mandatory Field
  const personalDetailsField = [
    {
      title: "Enumerator ID",
      key: "enumerator_id",
    },
    {
      title: "Enumerator Name",
      key: "name",
    },
    {
      title: "Email ID",
      key: "email",
    },
    {
      title: "Mobile (primary)",
      key: "mobile_primary",
    },
    {
      title: "Language",
      key: "language",
    },
    {
      title: "Address",
      key: "home_address",
    },
    {
      title: "Gender",
      key: "gender",
    },
    {
      title: "Enumerator type",
      key: "enumerator_type",
    },
  ];
  const locationDetailsField = [
    {
      title: "State",
      key: "state_id",
    },
    {
      title: "District",
      key: "district_id",
    },
    {
      title: "Block",
      key: "block_id",
    },
  ];

  const keysToExclude = [
    ...personalDetailsField.map((item) => item.key),
    ...locationDetailsField.map((item) => item.key),
  ];

  const extraCSVHeader = csvHeaders.filter(
    (item) => !keysToExclude.includes(item)
  );

  const csvHeaderOptions = csvHeaders.map((item, idx) => {
    return { label: item, value: item };
  });

  const handleEnumeratorUploadMapping = async () => {
    try {
      const values = await enumeratorMappingForm.validateFields();
      console.log("handleEnumeratorUploadMapping", values);
      const column_mapping = {};

      const requestData = {
        column_mapping: column_mapping,

        file: csvBase64Data,
        form_uid: form_uid,
      };

      console.log("requestData", requestData);
    } catch (error) {
      console.log("Form validation error:", error);

      const requiredErrors: any = {};
      const formFields = enumeratorMappingForm.getFieldsValue();

      for (const field in formFields) {
        const errors = enumeratorMappingForm.getFieldError(field);
        if (errors && errors.length > 0) {
          requiredErrors[field] = true;
        }
      }

      console.log("Required errors:", requiredErrors);
    }
  };

  function checkForDuplicates(
    rule: any,
    value: any,
    callback: (arg0: string | undefined) => void
  ) {
    const selectedColumns = personalDetailsField.map((item) => {
      return enumeratorMappingForm.getFieldValue(item.key);
    });

    const duplicateCount = selectedColumns.filter((column, index) => {
      return selectedColumns.indexOf(column) !== index && column !== undefined;
    }).length;

    if (duplicateCount > 0) {
      callback(
        "Column is already mapped. The same column cannot be mapped twice!"
      );
    } else {
      callback("");
    }
  }

  useEffect(() => {
    //redirect to upload if missing csvHeaders and cannot perform mapping
    //TODO: update this for configured surveys already
    if (csvHeaders.length < 1) {
      message.error("csvHeaders not found kindly reupload csv file");
      navigate(
        `/survey-information/enumerators/upload/${survey_uid}/${form_uid}`
      );
    }
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
          <EnumeratorsMapFormWrapper>
            {!hasError ? (
              <>
                <div>
                  <Title>Enumerators: Map CSV columns</Title>
                  <DescriptionText>
                    Select corresponding CSV column for the label on the left
                  </DescriptionText>
                </div>
                <Form form={enumeratorMappingForm}>
                  <div>
                    <HeadingText style={{ marginBottom: 22 }}>
                      Mandatory columns
                    </HeadingText>
                    <HeadingText>Personal Details and contact</HeadingText>
                    {personalDetailsField.map((item, idx) => {
                      return (
                        <Form.Item
                          label={item.title}
                          name={item.key}
                          key={idx}
                          rules={[
                            {
                              required: true,
                              message: "kindly select column to map value",
                            },
                            {
                              validator: checkForDuplicates,
                            },
                          ]}
                          labelCol={{ span: 5 }}
                          labelAlign="left"
                        >
                          <Select
                            style={{ width: 180 }}
                            filterOption={true}
                            placeholder="Choose column"
                            options={csvHeaderOptions}
                          />
                        </Form.Item>
                      );
                    })}
                    <HeadingText>Location Details</HeadingText>
                    {locationDetailsField.map((item, idx) => {
                      return (
                        <Form.Item
                          label={item.title}
                          name={item.key}
                          key={idx}
                          required={true}
                          labelCol={{ span: 5 }}
                          labelAlign="left"
                        >
                          <Select
                            style={{ width: 180 }}
                            filterOption={true}
                            placeholder="Choose column"
                            options={csvHeaderOptions}
                          />
                        </Form.Item>
                      );
                    })}
                    <HeadingText>Location ID</HeadingText>

                    <Form.Item
                      label="Prime geo location:"
                      name="location_id_column"
                      key="location_id_column"
                      required={true}
                      labelAlign="left"
                      labelCol={{ span: 5 }}
                    >
                      <Select
                        style={{ width: 180 }}
                        filterOption={true}
                        placeholder="Choose column"
                        options={csvHeaderOptions}
                      />
                    </Form.Item>

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
                            <Form.Item
                              label={item}
                              name={item}
                              key={idx}
                              labelCol={{ span: 5 }}
                              labelAlign="left"
                            >
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
                            </Form.Item>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        <HeadingText>
                          Want to map more columns, which are custom to your
                          survey and present in the csv? Click on the button
                          below after mapping the mandatory columns!
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
                </Form>
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
                        is ready with all the error rows. Use the button below
                        to download the csv.
                      </li>
                      <li>
                        <span style={{ fontWeight: 700 }}>View errors</span>:
                        The table below has the list of all the errors and the
                        corresponding row numbers. The original row numbers are
                        present as a column in the csv. Use this to edit the
                        csv.
                      </li>
                      <li>
                        <span style={{ fontWeight: 700 }}>
                          Correct and upload
                        </span>
                        : Once you are done with corrections, upload the csv
                        again.
                      </li>
                      <li>
                        <span style={{ fontWeight: 700 }}>Manage</span>: The
                        final list of enumerators is present in a table and that
                        can also be downloaded.
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
      )}
      <FooterWrapper>
        <SaveButton disabled>Save</SaveButton>
        <ContinueButton onClick={handleEnumeratorUploadMapping}>
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default EnumeratorsMap;
