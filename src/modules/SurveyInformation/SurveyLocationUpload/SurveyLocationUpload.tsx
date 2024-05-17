import { Alert, Col, Form, Row, Select, message } from "antd";
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
import { LinkOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import LocationTable from "./LocationTable";
import FileUpload from "./FileUpload";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import {
  getSurveyLocationGeoLevels,
  getSurveyLocations,
  postSurveyLocations,
} from "../../../redux/surveyLocations/surveyLocationsActions";
import { resetSurveyLocations } from "../../../redux/surveyLocations/surveyLocationsSlice";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { AddAnotherButton } from "../SurveyInformation.styled";
import { GeoLevelMapping } from "../../../redux/surveyLocations/types";
import { GlobalStyle } from "../../../shared/Global.styled";
import HandleBackButton from "../../../components/HandleBackButton";

function SurveyLocationUpload() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );
  const surveyLocationGeoLevels = useAppSelector(
    (state: RootState) => state.surveyLocations.surveyLocationGeoLevels
  );

  const surveyLocations = useAppSelector(
    (state: RootState) => state.surveyLocations.surveyLocations
  );

  const isLoading = useAppSelector(
    (state: RootState) => state.surveyLocations.loading
  );

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

  useEffect(() => {
    fetchSurveyLocations();

    fetchSurveyLocationGeoLevels();
    if (surveyLocations?.records?.length > 0) {
      setHasError(false);
      setColumnMatch(true);
      setFileUploaded(true);
    }

    return () => {
      dispatch(resetSurveyLocations());
    };
  }, [dispatch]);

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

  const renderLocationMappingSelect = () => {
    {
      return surveyLocationGeoLevels.map((geo_level, index) => {
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
                      return Promise.reject("Please select a unique column!");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Select
                placeholder="Choose column"
                options={csvColumnNames.map((columnName, columnIndex) => ({
                  label: columnName,
                  value: `${columnName}`,
                }))}
                onChange={(value) => handleOnChange(value, `${geo_level_name}`)}
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
                      return Promise.reject("Please select a unique column!");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Select
                placeholder="Choose another column"
                options={csvColumnNames.map((columnName, columnIndex) => ({
                  label: columnName,
                  value: `${columnName}`,
                }))}
                onChange={(value) =>
                  handleOnChange(value, `${geo_level_name_id}`)
                }
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

  const handleUploadContinue = () => {
    if (surveyLocations?.records?.length > 0 && !hasError) {
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
          const mappingsRes = await dispatch(
            postSurveyLocations({
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
          await dispatch(getSurveyLocations({ survey_uid: survey_uid }));
          setLoading(false);
          setHasError(false);
          setColumnMatch(true);
          setFileUploaded(true);
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
      <Header />
      <NavWrapper>
        <HandleBackButton></HandleBackButton>

        <Title>
          {(() => {
            const activeSurveyData = localStorage.getItem("activeSurvey");
            return (
              activeSurvey?.survey_name ||
              (activeSurveyData && JSON.parse(activeSurveyData).survey_name) ||
              ""
            );
          })()}
        </Title>
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
                      <p
                        style={{
                          fontFamily: "Lato",
                          fontWeight: 500,
                          color: "#262626",
                          marginTop: "24px",
                        }}
                      >
                        Match location table columns with locations created in
                        “Add location” step
                      </p>

                      {renderLocationMappingSelect()}
                    </Form>
                  </>
                ) : (
                  <>
                    {!hasError ? (
                      <>
                        <LocationTable
                          columns={surveyLocations?.ordered_columns}
                          data={surveyLocations?.records}
                        />
                      </>
                    ) : (
                      <>{renderLocationUploadErrors()}</>
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
