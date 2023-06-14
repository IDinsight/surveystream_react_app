import { Alert, Button, Col, Form, Row, Select, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../../components/Header";
import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
} from "../../../shared/Nav.styled";

import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../../shared/FooterBar.styled";
import SideMenu from "../SideMenu";
import {
  DescriptionText,
  IconText,
  SelectItem,
  SurveyLocationUploadFormWrapper,
} from "./SurveyLocationUpload.styled";
import {
  CloudDownloadOutlined,
  LinkOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import LocationTable from "./LocationTable";
import FileUpload from "./FileUpload";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import {
  getSurveyLocationGeoLevels,
  postSurveyLocations,
} from "../../../redux/surveyLocations/surveyLocationsActions";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import {
  AddAnotherButton,
  DynamicItemsForm,
} from "../SurveyInformation.styled";
import { GeoLevelMapping } from "../../../redux/surveyLocations/types";

function SurveyLocationUpload() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleGoBack = () => {
    navigate(-1);
  };

  const [form] = Form.useForm();

  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [columnMatch, setColumnMatch] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [loading, setLoading] = useState(false);
  const [csvColumnNames, setCSVColumnNames] = useState<string[]>([]);
  const [csvBase64Data, setCSVBase64Data] = useState<string | null>(null);
  const [mappedColumnNames, setMappedColumnNames] = useState<any>({});

  const activeSurvey = useAppSelector(
    (state: RootState) => state.reducer.surveys.activeSurvey
  );
  const surveyLocationGeoLevels = useAppSelector(
    (state: RootState) => state.reducer.surveyLocations.surveyLocationGeoLevels
  );

  const isLoading = useAppSelector(
    (state: RootState) => state.reducer.surveyLocations.loading
  );

  const fetchSurveyLocationGeoLevels = async () => {
    if (survey_uid != undefined) {
      await dispatch(getSurveyLocationGeoLevels({ survey_uid: survey_uid }));
    }
  };

  useEffect(() => {
    fetchSurveyLocationGeoLevels();
  }, [dispatch]);

  const handleFileUpload = (
    file: File,
    columnNames: string[],
    base64Data: string
  ) => {
    // Access the file upload results
    console.log("File:", file);
    console.log("Column Names:", columnNames);
    setCSVColumnNames(columnNames);
    setCSVBase64Data(base64Data);
  };

  const handleOnChange = (value: string, itemName: string) => {
    setMappedColumnNames((prevColumnNames: any) => {
      const updatedColumnNames = { ...prevColumnNames };

      console.log("updatedColumnNames", updatedColumnNames);

      updatedColumnNames[itemName] = value;
      return updatedColumnNames;
    });
  };

  const handleUploadContinue = () => {
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

        console.log("geoLevelMappings", geoLevelMappings);

        const requestData = {
          geo_level_mapping: geoLevelMappings,
          file: csvBase64Data,
        };

        console.log("requestData", requestData);

        if (survey_uid !== undefined) {
          const mappingsRes = await dispatch(
            postSurveyLocations({
              getLevelMappingData: requestData.geo_level_mapping,
              csvFile: requestData.file,
              surveyUid: survey_uid,
            })
          );

          console.log("mappingsRes", mappingsRes);
          if (mappingsRes.payload.status === false) {
            message.error(mappingsRes.payload.message);
            return;
          }
          message.success("Survey locations mapping updated successfully.");

          // navigate(`/survey-information/location/upload/${survey_uid}`);
        } else {
          message.error(
            "Kindly check that survey_uid is provided in the url to proceed."
          );
        }

        setLoading(false);

        // Use the requestData as needed (e.g., send it to the server)
      })
      .catch((error) => {
        setLoading(false);
        console.log("Form validation error:", error);
      });
  };

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

          <SurveyLocationUploadFormWrapper>
            {!fileUploaded || !columnMatch || hasError ? (
              <>
                <Title>Survey Location: Upload locations</Title>
                <DescriptionText>Upload locations CSV sheet</DescriptionText>
              </>
            ) : null}
            {!fileUploaded ? (
              <>
                <a style={{ textDecoration: "none", color: "#2f54eb" }}>
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
                      <p
                        style={{
                          fontFamily: "Inter",
                          fontWeight: 500,
                          color: "#262626",
                          marginTop: "24px",
                        }}
                      >
                        Match location table columns with locations created in
                        “Add location” step
                      </p>

                      {surveyLocationGeoLevels.map((geo_level, index) => {
                        const geo_level_name: string = geo_level.geo_level_name;
                        const geo_level_name_id = `${geo_level_name}_id`;

                        return (
                          <>
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
                                      return Promise.reject(
                                        "Please select a unique column!"
                                      );
                                    }
                                    return Promise.resolve();
                                  },
                                },
                              ]}
                            >
                              <Select
                                placeholder="Choose column"
                                options={csvColumnNames.map(
                                  (columnName, columnIndex) => ({
                                    label: columnName,
                                    value: `${columnName}`,
                                  })
                                )}
                                onChange={(value) =>
                                  handleOnChange(value, `${geo_level_name}`)
                                }
                              />
                            </SelectItem>
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
                                      return Promise.reject(
                                        "Please select a unique column!"
                                      );
                                    }
                                    return Promise.resolve();
                                  },
                                },
                              ]}
                            >
                              <Select
                                placeholder="Choose another column"
                                options={csvColumnNames.map(
                                  (columnName, columnIndex) => ({
                                    label: columnName,
                                    value: `${columnName}`,
                                  })
                                )}
                                onChange={(value) =>
                                  handleOnChange(value, `${geo_level_name_id}`)
                                }
                              />
                            </SelectItem>
                          </>
                        );
                      })}
                    </Form>
                  </>
                ) : (
                  <>
                    {!hasError ? (
                      <>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginRight: "80px",
                          }}
                        >
                          <p>Locations</p>
                          <Button
                            icon={<CloudDownloadOutlined />}
                            style={{
                              backgroundColor: "#2F54EB",
                              color: "#FFF",
                            }}
                          >
                            Download CSV
                          </Button>
                        </div>
                        <LocationTable />
                      </>
                    ) : (
                      <>
                        <Alert
                          message="File parsing error,  please upload the file again after making the corrections."
                          description={
                            <p>
                              The csv file could not be uploaded because of the
                              following errors:
                              <ol></ol>
                            </p>
                          }
                          type="error"
                          style={{ marginRight: "80px" }}
                        />
                        <AddAnotherButton
                          onClick={() => {
                            setFileUploaded(false);
                            setColumnMatch(false);
                            setHasError(false);
                          }}
                          type="dashed"
                          style={{ width: "100%" }}
                        >
                          ReUpload CSV
                        </AddAnotherButton>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </SurveyLocationUploadFormWrapper>
        </div>
      )}
      <FooterWrapper>
        <SaveButton>Save</SaveButton>
        <ContinueButton
          loading={loading}
          onClick={handleUploadContinue}
          disabled={!fileUploaded}
        >
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default SurveyLocationUpload;
