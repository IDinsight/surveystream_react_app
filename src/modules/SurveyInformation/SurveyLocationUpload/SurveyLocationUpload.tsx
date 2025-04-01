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
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Title, HeaderContainer } from "../../../shared/Nav.styled";

import {
  FooterWrapper,
  ContinueButton,
} from "../../../shared/FooterBar.styled";
import SideMenu from "../SideMenu";
import {
  IconText,
  SelectItem,
  SurveyLocationUploadFormWrapper,
} from "./SurveyLocationUpload.styled";
import {
  CloudUploadOutlined,
  CloudDownloadOutlined,
  LinkOutlined,
  EditTwoTone,
  ClearOutlined,
} from "@ant-design/icons";
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
import { AddAnotherButton } from "../SurveyInformation.styled";
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

function SurveyLocationUpload() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [columnMatch, setColumnMatch] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [uploadErrors, setUploadErrors] = useState<any>({});

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [loading, setLoading] = useState(false);
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
    if (surveyLocations?.records?.length > 0) {
      setHasError(false);
      setColumnMatch(true);
      setFileUploaded(true);

      const columns = [
        ...(surveyLocations?.ordered_columns ?? []),
        "edit_location",
      ];
      const data = surveyLocations?.records;

      setTransformedColumns(() =>
        columns.map((label: string) => {
          if (label === "edit_location") {
            return {
              title: "Edit",
              dataIndex: "edit",
              key: "edit",
              width: "12px",
              render: (_: any, record: any) => (
                <EditTwoTone
                  onClick={() => {
                    setDrawerVisible(true);
                    setSelectedRecord(record); // Set the selected record
                  }}
                />
              ),
            };
          } else {
            return {
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
            };
          }
        })
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
      fetchSurveyLocationsLong();
    }
  }, [dispatch, surveyLocations]);

  useEffect(() => {
    fetchSurveyLocations();
    fetchSurveyLocationGeoLevels();

    return () => {
      dispatch(resetSurveyLocations());
    };
  }, [dispatch, survey_uid]);

  const handleFileUpload = (
    file: File,
    columnNames: string[],
    base64Data: string
  ) => {
    // Access the file upload results
    setCSVColumnNames(columnNames);
    setCSVBase64Data(base64Data);
  };

  const handleOnChange = (value: string, itemName: string) => {
    setMappedColumnNames((prevColumnNames: any) => {
      const updatedColumnNames = { ...prevColumnNames };

      updatedColumnNames[itemName] = value;
      return updatedColumnNames;
    });
  };

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null); // State to hold the selected record

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
              labelCol={{ span: 5 }}
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
              labelCol={{ span: 5 }}
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
        <AddAnotherButton
          style={{ width: "200px" }}
          onClick={() => {
            setFileUploaded(false);
            setColumnMatch(false);
            setHasError(false);
          }}
          type="dashed"
        >
          Re-upload CSV
        </AddAnotherButton>
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
            return;
          }
          message.success("Survey locations mapping updated successfully.");

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
        <Title>Upload Locations</Title>

        <div style={{ display: "flex", marginLeft: "auto" }}>
          {!hasError && fileUploaded && columnMatch ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                type="primary"
                onClick={handlerAddLocationButton}
                icon={<CloudUploadOutlined />}
                style={{ marginRight: 15, backgroundColor: "#2f54eB" }}
              >
                Add locations
              </Button>
              <CSVDownloader
                data={transformedData}
                filename={"locations.csv"}
                style={{
                  fontFamily: "Lato",
                  cursor: "pointer",
                  backgroundColor: "#2F54EB",
                  color: "#FFF",
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  fontSize: "14px",
                }}
              >
                <CloudDownloadOutlined style={{ marginRight: "8px" }} />
                Download CSV
              </CSVDownloader>
              <Button
                onClick={resetFilters}
                icon={<ClearOutlined />}
                style={{
                  cursor: "pointer",
                  marginLeft: 15,
                  padding: "8px 16px",
                  borderRadius: "5px",
                  fontSize: "14px",
                }}
              ></Button>
            </div>
          ) : null}
        </div>
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
                  <DescriptionText>Upload locations CSV sheet</DescriptionText>
                  <a
                    href="https://drive.google.com/drive/folders/1_5wpXsAPutiXq5jA4XwPQZQHDUkMbX2S?usp=drive_link"
                    target="__blank"
                    style={{ textDecoration: "none", color: "#2f54eb" }}
                  >
                    <LinkOutlined style={{ fontSize: "14px" }} />
                    <IconText>Download template</IconText>
                  </a>
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
                          Match location table columns with location levels
                          created in “Add/Edit location levels” step
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
                          />
                        </>
                      ) : (
                        <>{renderLocationUploadErrors()}</>
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
              title="Add locations"
              open={addLocationsModal}
              okText="Continue"
              onOk={handleLocationsAddMode}
              onCancel={() => setAddLocationsModal(false)}
            >
              <Divider />
              <p>Please select how you want to proceed:</p>
              <Radio.Group
                style={{ marginBottom: 20 }}
                onChange={(e) => setLocationsAddMode(e.target.value)}
                value={locationsAddMode}
              >
                <Space direction="vertical">
                  <Radio value="overwrite">
                    I want to start fresh (Locations uploaded previously will be
                    deleted)
                  </Radio>
                  <Radio value="append">
                    I want to append new locations to the existing locations
                    data
                  </Radio>
                </Space>
              </Radio.Group>
              <span>
                Kindly Reupload enumerators, targets csv with new location data.
              </span>
            </Modal>
          </div>
          {selectedRecord && (
            <LocationEditDrawer
              visible={drawerVisible}
              onClose={closeDrawer}
              selectedRecord={selectedRecord}
              dataTable={longformedData}
              geoLevels={surveyLocationGeoLevels}
              surveyUID={survey_uid!}
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
