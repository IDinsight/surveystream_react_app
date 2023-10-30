import { Alert, Button, Checkbox, Col, Form, Row, Select, message } from "antd";
import { Title } from "../../../../shared/Nav.styled";
import {
  DescriptionContainer,
  DescriptionText,
  EnumeratorsRemapFormWrapper,
  ErrorTable,
  HeadingText,
  StyledBreadcrumb,
} from "./EnumeratorsRemap.styled";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  CloseOutlined,
  CloudUploadOutlined,
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import RowCountBox from "../../../../components/RowCountBox";
import { RootState } from "../../../../redux/store";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

interface CSVError {
  type: string;
  count: number;
  rows: string;
}

interface IEnumeratorsReupload {
  setScreenMode: Dispatch<SetStateAction<string>>;
}

function EnumeratorsRemap({ setScreenMode }: IEnumeratorsReupload) {
  const [enumeratorMappingForm] = Form.useForm();
  const [hasError, setHasError] = useState<boolean>(true);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [errorList, setErrorList] = useState<CSVError[]>([]);
  const [customHeader, setCustomHeader] = useState<boolean>(false);
  const [customHeaderSelection, setCustomHeaderSelection] = useState<any>({});
  const [locationBatchField, setLocationBatchField] = useState<any>([]);
  const [extraCSVHeader, setExtraCSVHeader] = useState<any>([]);

  const dispatch = useAppDispatch();

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const isLoading = useAppSelector(
    (state: RootState) => state.enumerators.loading
  );

  const quesLoading = useAppSelector(
    (state: RootState) => state.surveyConfig.loading
  );

  const locLoading = useAppSelector(
    (state: RootState) => state.surveyLocations.loading
  );

  const csvHeaders = useAppSelector(
    (state: RootState) => state.enumerators.csvColumnNames
  );

  const csvRows = useAppSelector(
    (state: RootState) => state.enumerators.csvRows
  );

  const csvBase64Data = useAppSelector(
    (state: RootState) => state.enumerators.csvBase64Data
  );
  const moduleQuestionnaire = useAppSelector(
    (state: RootState) => state.surveyConfig.moduleQuestionnaire
  );
  const surveyLocationGeoLevels = useAppSelector(
    (state: RootState) => state.surveyLocations.surveyLocationGeoLevels
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

  const personalBatchField = [
    "enumerator_id",
    "name",
    "email",
    "mobile_primary",
    "home_address",
  ];

  const csvHeaderOptions = csvHeaders.map((item, idx) => {
    return { label: item, value: item };
  });

  const moveToUpload = () => {
    setScreenMode("reupload");
  };

  const updateCustomColumns = (value: string) => {
    const formValues = enumeratorMappingForm.getFieldsValue();

    const valuesArray = Object.values(formValues);

    const extraHeaders = csvHeaders.filter((item: any) => {
      return !valuesArray.includes(item);
    });

    setExtraCSVHeader(extraHeaders);
  };

  useEffect(() => {
    //redirect to upload if missing csvHeaders and cannot perform mapping
    if (csvHeaders.length < 1) {
      message.error("csvHeaders not found kindly reupload csv file");
    }

    const keysToExclude = [...personalDetailsField.map((item) => item.key)];

    const extraHeaders = csvHeaders.filter(
      (item) => !keysToExclude.includes(item)
    );

    setExtraCSVHeader(extraHeaders);
  }, []);

  const handleContinueBtn = () => {
    // TODO: Integration
    setScreenMode("manage");
  };

  return (
    <>
      <EnumeratorsRemapFormWrapper>
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
        {!hasError ? (
          <>
            <StyledBreadcrumb
              separator=">"
              items={[
                { title: "Upload csv" },
                { title: "Map csv columns", className: "active" },
                { title: "Update enumerators" },
              ]}
            />
            <Form form={enumeratorMappingForm}>
              <div>
                <HeadingText style={{ marginBottom: 22 }}>
                  Mandatory columns
                </HeadingText>
                <Alert
                  message="Mandatory columns: Email ID and Language (p) unavailable in new csv. Please map them to other columns."
                  type="error"
                  showIcon
                  style={{ width: 754, marginBottom: 20 }}
                />
                <HeadingText>Personal and contact details</HeadingText>
                {personalDetailsField.map((item, idx) => {
                  return (
                    <Form.Item
                      label={item.title}
                      name={item.key}
                      key={idx}
                      rules={[
                        {
                          required:
                            (item.key === "language" &&
                              !moduleQuestionnaire?.supervisor_assignment_criteria.includes(
                                "Language"
                              )) ||
                            item.key === "home_address"
                              ? false
                              : true,
                          message: "Kindly select column to map value!",
                        },
                        {
                          validator: async (_, value) => {
                            if (!value) {
                              return Promise.resolve(); // No need to check if value is empty
                            }
                            const formValues =
                              enumeratorMappingForm.getFieldsValue();

                            const valuesArray = Object.values(formValues);
                            // Count occurrences of the selected value in the valuesArray
                            const selectedValueCount = valuesArray.filter(
                              (val) => val === value
                            ).length;

                            // Check if the selected value is contained more than once
                            if (selectedValueCount > 1) {
                              return Promise.reject(
                                "Column is already mapped. The same column cannot be mapped twice!"
                              );
                            }

                            return Promise.resolve();
                          },
                        },
                      ]}
                      labelCol={{ span: 5 }}
                      labelAlign="left"
                    >
                      <Select
                        onChange={updateCustomColumns}
                        style={{ width: 180 }}
                        filterOption={true}
                        placeholder="Choose column"
                        options={csvHeaderOptions}
                      />
                    </Form.Item>
                  );
                })}
                {locationBatchField.length > 0 ? (
                  <>
                    <HeadingText>Location ID</HeadingText>

                    <Form.Item
                      label="Prime geo location:"
                      name="location_id_column"
                      key="location_id_column"
                      required
                      labelAlign="left"
                      labelCol={{ span: 5 }}
                      rules={[
                        {
                          required: true,
                          message: "Kindly select column to map value!",
                        },
                        {
                          validator: async (_, value) => {
                            if (!value) {
                              return Promise.resolve(); // No need to check if value is empty
                            }
                            const formValues =
                              enumeratorMappingForm.getFieldsValue();

                            const valuesArray = Object.values(formValues);
                            // Count occurrences of the selected value in the valuesArray
                            const selectedValueCount = valuesArray.filter(
                              (val) => val === value
                            ).length;

                            // Check if the selected value is contained more than once
                            if (selectedValueCount > 1) {
                              return Promise.reject(
                                "Column is already mapped. The same column cannot be mapped twice!"
                              );
                            }

                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Select
                        onChange={updateCustomColumns}
                        style={{ width: 180 }}
                        filterOption={true}
                        placeholder="Choose column"
                        options={csvHeaderOptions}
                      />
                    </Form.Item>
                  </>
                ) : null}

                {customHeader ? (
                  <>
                    <HeadingText>Custom columns</HeadingText>
                    <Alert
                      message={`Custom columns: ${extraCSVHeader.length} new custom columns found`}
                      type="warning"
                      showIcon
                      style={{ width: 375, marginBottom: 20 }}
                    />
                    {extraCSVHeader.map((item: any, idx: any) => {
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
                          <Checkbox style={{ marginLeft: 10 }}>
                            Mandatory
                          </Checkbox>
                        </Form.Item>
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
                        extraCSVHeader.forEach((item: string, idx: any) => {
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
            <Button
              type="primary"
              style={{ backgroundColor: "#2f54eB", marginTop: 20 }}
              onClick={handleContinueBtn}
            >
              Continue
            </Button>
          </>
        ) : (
          <>
            <div>
              <StyledBreadcrumb
                separator=">"
                items={[
                  { title: "Upload csv" },
                  { title: "Map csv columns" },
                  { title: "Update enumerators", className: "active" },
                ]}
              />
              <RowCountBox
                total={csvRows.length - 1}
                correct={
                  csvRows.length - 1 - errorCount > 0
                    ? csvRows.length - 1 - errorCount
                    : 0
                }
                error={errorCount}
                warning={0}
              />
              <DescriptionContainer>
                <ol style={{ paddingLeft: "15px" }}>
                  <li>
                    <span style={{ fontWeight: 700 }}>Download</span>: A csv is
                    ready with all the error rows. Use the button below to
                    download the csv.
                  </li>
                  <li>
                    <span style={{ fontWeight: 700 }}>View errors</span>: The
                    table below has the list of all the errors and the
                    corresponding row numbers. The original row numbers are
                    present as a column in the csv. Use this to edit the csv.
                  </li>
                  <li>
                    <span style={{ fontWeight: 700 }}>Correct and upload</span>:
                    Once you are done with corrections, upload the csv again.
                  </li>
                  <li>
                    <span style={{ fontWeight: 700 }}>Manage</span>: The final
                    list of enumerators is present in a table and that can also
                    be downloaded.
                  </li>
                </ol>
              </DescriptionContainer>
            </div>
            {errorList !== null && (
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
            )}
            <div style={{ display: "flex" }}>
              <Button
                onClick={moveToUpload}
                type="primary"
                icon={<CloudUploadOutlined />}
                style={{ backgroundColor: "#2f54eB" }}
              >
                Upload CSV again
              </Button>
            </div>
          </>
        )}
      </EnumeratorsRemapFormWrapper>
    </>
  );
}

export default EnumeratorsRemap;
