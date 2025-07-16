import {
  Alert,
  Col,
  Form,
  Row,
  Select,
  message,
  Button,
  Modal,
  Radio,
  Space,
  Divider,
  Tooltip,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Title, HeaderContainer } from "../../../shared/Nav.styled";

import SideMenu from "../SideMenu";
import {
  SelectItem,
  SurveyLocationUploadFormWrapper,
} from "./SurveyLocationUpload.styled";
import { ClearOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import LocationTable from "./LocationTable";
import FileUpload from "./FileUpload";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import {
  getSurveyLocationGeoLevels,
  getSurveyLocations,
  postSurveyLocations,
  puturveyLocations,
  getSurveyLocationsLong,
} from "../../../redux/surveyLocations/surveyLocationsActions";
import { resetSurveyLocations } from "../../../redux/surveyLocations/surveyLocationsSlice";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { GeoLevelMapping } from "../../../redux/surveyLocations/types";
import { GlobalStyle } from "../../../shared/Global.styled";
import Container from "../../../components/Layout/Container";
import { useCSVDownloader } from "react-papaparse";
import { LocationEditDrawer } from "./LocationEditDrawer";
import { CustomBtn, DescriptionText } from "../../../shared/Global.styled";
import {
  createNotificationViaAction,
  resolveSurveyNotification,
} from "../../../redux/notifications/notificationActions";
import DescriptionLink from "../../../components/DescriptionLink/DescriptionLink";
import LocationsCountBox from "../../../components/LocationsCountBox";
import ErrorWarningTable from "../../../components/ErrorWarningTable";
import RowCountBox from "../../../components/RowCountBox";

function SurveyLocationUpload() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [columnMatch, setColumnMatch] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [uploadErrors, setUploadErrors] = useState<any>({});
  const [errorList, setErrorList] = useState<any[]>([]); // <-- Add errorList state
  const [locationsCount, setLocationsCount] = useState<number>(0);
  const [smallestLocationLevelName, setSmallestLocationLevelName] =
    useState<string>("");

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [loading, setLoading] = useState<boolean>(true);
  const [csvColumnNames, setCSVColumnNames] = useState<string[]>([]);
  const [csvBase64Data, setCSVBase64Data] = useState<string | null>(null);
  const [mappedColumnNames, setMappedColumnNames] = useState<any>({});
  const [transformedData, setTransformedData] = useState<any>([]);
  const [transformedColumns, setTransformedColumns] = useState<any>([]);
  const [longformedData, setLongformedData] = useState<any>([]);
  const { CSVDownloader, Type } = useCSVDownloader();

  const surveyLocationGeoLevels = useAppSelector(
    (state: RootState) => state.surveyLocations.surveyLocationGeoLevels
  );

  const surveyLocations = useAppSelector(
    (state: RootState) => state.surveyLocations.surveyLocations
  );

  const isLoading = useAppSelector(
    (state: RootState) => state.surveyLocations.loading
  );

  const { loading: isSideMenuLoading } = useAppSelector(
    (state: RootState) => state.surveyConfig
  );

  const [addLocationsModal, setAddLocationsModal] = useState(false);
  const [locationsAddMode, setLocationsAddMode] = useState("overwrite");
  const [selectedRecord, setSelectedRecord] = useState<any>(null); // State to hold the selected record
  const [csvTotalRows, setCSVTotalRows] = useState<number>(0);

  const resetFilters = async () => {
    fetchSurveyLocations();
  };

  const handlerAddLocationButton = () => {
    setAddLocationsModal(true);
  };

  const handleLocationsAddMode = () => {
    // Change this to reupload screen and set the locationsAddMode as a state variable
    setAddLocationsModal(false);
    setFileUploaded(false);
    setColumnMatch(false);
    setHasError(false);
  };

  const fetchSurveyLocationGeoLevels = async () => {
    if (survey_uid != undefined) {
      await dispatch(getSurveyLocationGeoLevels({ survey_uid: survey_uid }));
    }
  };

  const fetchSurveyLocations = async () => {
    if (survey_uid != undefined) {
      const res = await dispatch(
        getSurveyLocations({ survey_uid: survey_uid })
      );
      if (res.payload?.records?.length > 0) {
        setHasError(false);
        setColumnMatch(true);
        setFileUploaded(true);
      }
    }
  };
  const fetchSurveyLocationsLong = async () => {
    if (survey_uid != undefined) {
      const geoLevels = surveyLocationGeoLevels.map(async (geoLevel) => {
        const longLocation = await dispatch(
          getSurveyLocationsLong({
            survey_uid: survey_uid,
            geo_level_uid: geoLevel.geo_level_uid,
          })
        );
        return longLocation.payload;
      });
      const allGeoLevelData = await Promise.all(geoLevels);
      setLongformedData(allGeoLevelData.flat());
    }
  };

  useEffect(() => {
    const updataData = async () => {
      if (surveyLocations?.records?.length > 0) {
        setHasError(false);
        setColumnMatch(true);
        setFileUploaded(true);

        const columns = [...(surveyLocations?.ordered_columns ?? [])];
        const data = surveyLocations?.records;

        setTransformedColumns(() =>
          columns.map((label: string) => ({
            title: label,
            dataIndex: label.toLocaleLowerCase(),
            key: label.toLocaleLowerCase(),
            filters: [
              ...new Set(
                surveyLocations.records.map(
                  (record: Record<string, string | number>) => record[label]
                )
              ),
            ].map((value: any) => ({
              text: value.toString(),
              value: value.toString(),
            })),
            sorter: (
              a: Record<string, string | number>,
              b: Record<string, string | number>
            ) =>
              a[label.toLocaleLowerCase()] > b[label.toLocaleLowerCase()]
                ? -1
                : 1,
            onFilter: (
              value: string | number,
              record: Record<string, string | number>
            ) => {
              return record[label.toLocaleLowerCase()] === value;
            },
          }))
        );

        setTransformedData(() =>
          data.map((record: any, index: number) => {
            const transformedRecord: any = {};
            columns.forEach((column: string) => {
              transformedRecord[column.toLocaleLowerCase()] = record[column];
            });
            transformedRecord.key = index;
            return transformedRecord;
          })
        );

        setLocationsCount(surveyLocations?.records?.length);
        setSmallestLocationLevelName(
          surveyLocationGeoLevels[surveyLocationGeoLevels.length - 1]
            ?.geo_level_name
        );

        await fetchSurveyLocationsLong(); // Wait for the function to complete
      }
    };
    updataData();
  }, [surveyLocations]);

  useEffect(() => {
    if (surveyLocationGeoLevels?.length > 0) {
      setSmallestLocationLevelName(
        surveyLocationGeoLevels[surveyLocationGeoLevels.length - 1]
          ?.geo_level_name
      );
    }
  }, [surveyLocationGeoLevels]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchSurveyLocations();
      await fetchSurveyLocationGeoLevels();
      setLoading(false);
    };
    if (survey_uid !== "") {
      fetchData();
    }

    return () => {
      dispatch(resetSurveyLocations());
    };
  }, [survey_uid]);

  const handleFileUpload = (
    file: File,
    columnNames: string[],
    base64Data: string
  ) => {
    // Access the file upload results
    setCSVColumnNames(columnNames);
    setCSVBase64Data(base64Data);
    // Try to count rows in the file
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        // Split by newlines, filter out empty lines
        const rows = text.split(/\r?\n/).filter((row) => row.trim() !== "");
        setCSVTotalRows(rows.length);
      }
    };
    reader.readAsText(file);
  };

  const handleOnChange = (value: string, itemName: string) => {
    setMappedColumnNames((prevColumnNames: any) => {
      const updatedColumnNames = { ...prevColumnNames };

      updatedColumnNames[itemName] = value;
      return updatedColumnNames;
    });
  };

  const [drawerVisible, setDrawerVisible] = useState(false);

  const closeDrawer = async () => {
    setDrawerVisible(false);
    setSelectedRecord(null);
  };

  const renderLocationMappingSelect = () => {
    {
      return surveyLocationGeoLevels.map((geo_level, index) => {
        const geo_level_name: string = geo_level.geo_level_name;
        const geo_level_name_id = `${geo_level_name}_id`;

        return (
          <>
            <SelectItem
              label={`${geo_level_name} ID`}
              required
              name={geo_level_name_id}
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 5 }}
              rules={[
                {
                  required: true,
                  message: "Please select a column!",
                },
                {
                  validator: (_: any, value: any) => {
                    if (
                      value &&
                      Object.values(mappedColumnNames).filter(
                        (name) => name === value
                      ).length > 1
                    ) {
                      return Promise.reject("Please select a unique column!");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Select
                placeholder="Choose ID column"
                filterOption={true}
                showSearch={true}
                allowClear={true}
                options={csvColumnNames.map((columnName, columnIndex) => ({
                  label: columnName,
                  value: `${columnName}`,
                }))}
                onChange={(value) =>
                  handleOnChange(value, `${geo_level_name_id}`)
                }
              />
            </SelectItem>
            <SelectItem
              label={geo_level_name}
              required
              name={geo_level_name}
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 5 }}
              rules={[
                {
                  required: true,
                  message: "Please select a column!",
                },
                {
                  validator: (_: any, value: any) => {
                    if (
                      value &&
                      Object.values(mappedColumnNames).filter(
                        (name) => name === value
                      ).length > 1
                    ) {
                      return Promise.reject("Please select a unique column!");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Select
                placeholder="Choose name column"
                filterOption={true}
                showSearch={true}
                allowClear={true}
                options={csvColumnNames.map((columnName, columnIndex) => ({
                  label: columnName,
                  value: `${columnName}`,
                }))}
                onChange={(value) => handleOnChange(value, `${geo_level_name}`)}
              />
            </SelectItem>
          </>
        );
      });
    }
  };

  const renderLocationUploadErrors = () => {
    const fileErrorList = uploadErrors.file.map(
      (item: string, index: number) => <li key={index}>{item}</li>
    );
    const geoErrorList = uploadErrors.geo_level_mapping.map(
      (item: string, index: number) => <li key={index}>{item}</li>
    );

    return (
      <>
        <Alert
          message="File parsing error,please upload the file again after making the corrections."
          description={
            <>
              <p>
                The csv file could not be uploaded because of the following
                errors:
              </p>

              <ol>{fileErrorList}</ol>
              <ol>{geoErrorList}</ol>
            </>
          }
          type="error"
          style={{ marginRight: "80px" }}
        />
        <CustomBtn
          style={{ marginTop: 24 }}
          onClick={() => {
            setFileUploaded(false);
            setColumnMatch(false);
            setHasError(false);
          }}
        >
          Re-upload CSV
        </CustomBtn>
      </>
    );
  };
  const createNotification = async (notification_input: string[]) => {
    if (notification_input.length > 0) {
      for (const notification of notification_input) {
        try {
          const data = {
            action: notification,
            survey_uid: survey_uid,
          };
          await dispatch(createNotificationViaAction(data));
        } catch (error) {
          console.error("Failed to create notification:", error);
        }
      }
    }
  };

  const handleUploadContinue = () => {
    if (
      surveyLocations?.records?.length > 0 &&
      !hasError &&
      fileUploaded &&
      columnMatch
    ) {
      navigate(`/survey-configuration/${survey_uid}`);
      return;
    }
    form
      .validateFields()
      .then(async () => {
        setLoading(true);

        const geoLevelMappings: GeoLevelMapping[] = Object.keys(
          mappedColumnNames
        )
          .map((itemName) => {
            if (!itemName.endsWith("_id")) {
              const geoLevelUid = surveyLocationGeoLevels.find(
                (geoLevel) => geoLevel.geo_level_name === itemName
              )?.geo_level_uid;

              if (geoLevelUid !== undefined) {
                return {
                  geo_level_uid: geoLevelUid,
                  location_name_column: mappedColumnNames[itemName],
                  location_id_column: mappedColumnNames[`${itemName}_id`],
                };
              }
            }
          })
          .filter(
            (mapping): mapping is GeoLevelMapping => mapping !== undefined
          );

        const requestData = {
          geo_level_mapping: geoLevelMappings,
          file: csvBase64Data,
        };

        if (survey_uid !== undefined) {
          const mappingsRes =
            locationsAddMode === "overwrite"
              ? await dispatch(
                  postSurveyLocations({
                    getLevelMappingData: requestData.geo_level_mapping,
                    csvFile: requestData.file,
                    surveyUid: survey_uid,
                  })
                )
              : await dispatch(
                  puturveyLocations({
                    getLevelMappingData: requestData.geo_level_mapping,
                    csvFile: requestData.file,
                    surveyUid: survey_uid,
                  })
                );
          if (mappingsRes.payload.success === false) {
            message.error(mappingsRes.payload.message);
            setLoading(false);
            setUploadErrors(mappingsRes.payload.errors);
            setHasError(true);
            setColumnMatch(true);
            setFileUploaded(true);
            // Transform error response for ErrorWarningTable
            const summary =
              mappingsRes.payload.errors.record_errors?.summary_by_error_type ||
              [];
            const formattedErrors = summary.map((err: any) => ({
              type: err.error_type,
              count: err.error_count,
              message: err.error_message,
              rows: err.row_numbers_with_errors?.join(", ") || "",
            }));
            setErrorList(formattedErrors);
            return;
          }
          message.success("Survey locations uploaded successfully.");

          // Resolve existing location notifications
          await dispatch(
            resolveSurveyNotification({
              survey_uid: survey_uid,
              module_id: 5,
              resolution_status: "done",
            })
          );

          // Create notification to inform user that locations have been reuploaded
          createNotification(["Locations reuploaded"]);

          await dispatch(getSurveyLocations({ survey_uid: survey_uid }));
          await fetchSurveyLocationsLong();
          setLoading(false);
          setHasError(false);
          setColumnMatch(true);
          setFileUploaded(true);
          setLocationsAddMode("overwrite");
        } else {
          message.error(
            "Kindly check that survey_uid is provided in the url to proceed."
          );
          setLoading(false);
          setHasError(true);
          setColumnMatch(true);
          setFileUploaded(true);
        }

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("Form validation error:", error);
      });
  };

  return (
    <>
      <GlobalStyle />
      <Container surveyPage={true} />
      <HeaderContainer>
        {!hasError && fileUploaded && columnMatch ? (
          <>
            <Title> Locations</Title>
            {isLoading || loading || isSideMenuLoading ? null : (
              <LocationsCountBox
                locationsCount={locationsCount}
                smallestLocationLevelName={smallestLocationLevelName}
              />
            )}
            <div style={{ display: "flex", marginLeft: "auto" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Tooltip
                  title={selectedRecord ? null : "Select a record to edit"}
                >
                  <CustomBtn
                    onClick={() => {
                      setDrawerVisible(true);
                    }}
                    style={{
                      marginRight: 15,
                    }}
                    disabled={!selectedRecord}
                  >
                    Edit
                  </CustomBtn>
                </Tooltip>

                <CustomBtn
                  onClick={handlerAddLocationButton}
                  style={{ marginRight: 15 }}
                >
                  Add locations
                </CustomBtn>
                <CSVDownloader
                  data={() =>
                    transformedData.map((record: any) => {
                      const transformedRecord: any = {};
                      // Drop key property
                      Object.keys(record).forEach((key) => {
                        if (key !== "key") {
                          transformedRecord[key] = record[key];
                        }
                      });
                      return transformedRecord;
                    })
                  }
                  filename={"locations"}
                  extension=".csv"
                >
                  <CustomBtn style={{ marginRight: 15 }}>
                    Download CSV
                  </CustomBtn>
                </CSVDownloader>
                <Tooltip title="Clear sort and filters">
                  <Button
                    onClick={resetFilters}
                    icon={<ClearOutlined />}
                    style={{
                      cursor: "pointer",
                      padding: "8px 16px",
                      borderRadius: "5px",
                      fontSize: "14px",
                    }}
                  ></Button>
                </Tooltip>
              </div>
            </div>
          </>
        ) : (
          <Title> Upload Locations</Title>
        )}
      </HeaderContainer>
      {isLoading || loading || isSideMenuLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <SurveyLocationUploadFormWrapper>
              {!fileUploaded ? (
                <>
                  <DescriptionText>
                    Upload a .csv file containing the locations for your survey.{" "}
                    <DescriptionLink link="https://docs.surveystream.idinsight.io/locations_configuration#datasets-to-prepare" />
                  </DescriptionText>
                  <div style={{ marginTop: "40px" }}>
                    <Form layout="horizontal">
                      <Row>
                        <Col span={22}>
                          <FileUpload
                            style={{ height: "250px" }}
                            setUploadStatus={setFileUploaded}
                            onFileUpload={handleFileUpload}
                          />
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </>
              ) : (
                <>
                  {!columnMatch ? (
                    <>
                      <Form form={form}>
                        <DescriptionText>
                          Match the columns in the file with location levels
                          created in “Add/Edit Location Levels” step
                        </DescriptionText>
                        {renderLocationMappingSelect()}
                      </Form>
                    </>
                  ) : (
                    <>
                      {!hasError ? (
                        <>
                          <LocationTable
                            transformedColumns={transformedColumns}
                            transformedData={transformedData}
                            rowSelection={{
                              hideSelectAll: true,
                              type: "checkbox",
                              selectedRowKeys: selectedRecord
                                ? [selectedRecord.key]
                                : [],
                              onChange: (
                                selectedRowKeys: React.Key[],
                                selectedRows: any[]
                              ) => {
                                // Only keep the most recently selected row
                                const lastSelectedRow =
                                  selectedRows[selectedRows.length - 1] || null;
                                setSelectedRecord(lastSelectedRow);
                              },
                            }}
                          />
                        </>
                      ) : (
                        <div>
                          <Title>Locations</Title>
                          <br />
                          <RowCountBox
                            total={csvTotalRows}
                            correct={Math.max(
                              0,
                              csvTotalRows -
                                errorList.reduce(
                                  (acc, err) => acc + (err.count || 0),
                                  0
                                )
                            )}
                            error={errorList.reduce(
                              (acc, err) => acc + (err.count || 0),
                              0
                            )}
                            warning={0}
                          />
                          <DescriptionText>
                            <ol style={{ paddingLeft: "15px" }}>
                              <li>
                                <span style={{ fontWeight: 700 }}>
                                  Download
                                </span>
                                : A csv is ready with all the error rows. Use
                                the button below to download the csv.
                              </li>
                              <li>
                                <span style={{ fontWeight: 700 }}>
                                  View errors
                                </span>
                                : The table below has the list of all the errors
                                and the corresponding row numbers. The original
                                row numbers are present as a column in the csv.
                                Use this to edit the csv.
                              </li>
                              <li>
                                <span style={{ fontWeight: 700 }}>
                                  Correct and upload
                                </span>
                                : Once you are done with corrections, upload the
                                csv again.
                              </li>
                              <li>
                                <span style={{ fontWeight: 700 }}>Manage</span>:
                                The final list of targets is present in a table
                                and that can also be downloaded.
                              </li>
                            </ol>
                          </DescriptionText>
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
                          <ErrorWarningTable
                            errorList={errorList}
                            showErrorTable={true}
                            showWarningTable={false}
                          />
                          <CustomBtn
                            style={{ marginTop: 24 }}
                            onClick={() => {
                              setFileUploaded(false);
                              setColumnMatch(false);
                              setHasError(false);
                              setErrorList([]);
                            }}
                          >
                            Re-upload CSV
                          </CustomBtn>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              {fileUploaded && !columnMatch ? (
                <CustomBtn
                  loading={loading}
                  onClick={handleUploadContinue}
                  disabled={!fileUploaded}
                  style={{ marginTop: 24 }}
                >
                  Continue
                </CustomBtn>
              ) : null}
            </SurveyLocationUploadFormWrapper>
            <Modal
              title="Add Locations"
              open={addLocationsModal}
              okText="Continue"
              onOk={handleLocationsAddMode}
              onCancel={() => setAddLocationsModal(false)}
            >
              <Divider style={{ marginTop: 0 }} />
              <p>Please select how you want to proceed:</p>
              <Radio.Group
                style={{ marginBottom: 20 }}
                onChange={(e) => setLocationsAddMode(e.target.value)}
                value={locationsAddMode}
              >
                <Space direction="vertical">
                  <Radio value="overwrite">
                    I want to start fresh (This action will delete previously
                    uploaded locations. You will also need to reupload
                    enumerators, targets and users with new location data.)
                  </Radio>
                  <Radio value="append">
                    I want to append new locations to the existing locations
                    data
                  </Radio>
                </Space>
              </Radio.Group>
            </Modal>
          </div>
          {selectedRecord && (
            <LocationEditDrawer
              visible={drawerVisible}
              onClose={closeDrawer}
              selectedRecord={selectedRecord}
              dataTable={longformedData}
              geoLevels={surveyLocationGeoLevels}
              surveyUID={survey_uid || ""}
              loading={loading}
              setLoading={setLoading}
            />
          )}
        </>
      )}
    </>
  );
}

export default SurveyLocationUpload;
