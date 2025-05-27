import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import Container from "../../../components/Layout/Container";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";

import { HeaderContainer } from "../../../shared/Nav.styled";
import {
  CustomBtn,
  DescriptionText,
  DQFormWrapper,
  FormItemLabel,
  SCTOLoadErrorArea,
} from "./DQForm.styled";
import { getSurveyCTOForm } from "../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { RootState } from "../../../redux/store";
import { Button, Col, Row, Select, Tooltip, message, Alert } from "antd";
import { getCTOFormQuestions } from "../../../redux/surveyCTOQuestions/surveyCTOQuestionsActions";
import { getSurveyLocationGeoLevels } from "../../../redux/surveyLocations/surveyLocationsActions";
import { userHasPermission } from "../../../utils/helper";
import {
  createSCTOFormMapping,
  getSCTOFormMapping,
  updateSCTOFormMapping,
} from "../../../redux/dqForm/dqFormActions";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import SideMenu from "./../SideMenu";

function DQFormSCTOQuestion() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  const { dq_form_uid } = useParams<{ dq_form_uid?: string }>() ?? {
    dq_form_uid: "",
  };

  if (!survey_uid || !dq_form_uid) {
    navigate("/surveys");
  }

  const userProfile = useAppSelector((state: RootState) => state.auth.profile);
  const canUserWrite = userHasPermission(
    userProfile,
    survey_uid,
    "WRITE Data Quality Forms"
  );

  const { loading: isSurveyCTOFormLoading, surveyCTOForm } = useAppSelector(
    (state: RootState) => state.surveyCTOInformation
  );

  const { loading: isLoadingSurveyLocationGeoLevels, surveyLocationGeoLevels } =
    useAppSelector((state: RootState) => state.surveyLocations);

  const surveyCTOQuestions = useAppSelector(
    (state: RootState) => state.surveyCTOQuestions.surveyCTOQuestions
  );

  const { loading: isDQFormLoading } = useAppSelector(
    (state: RootState) => state.dqForms
  );

  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [isNewMapping, setIsNewMapping] = useState<boolean>(false);
  const [defaultLocationFormat, setDefaultLocationFormat] = useState({});

  const [hasError, setHasError] = useState<boolean>(false);
  const [surveyCTOErrorMessages, setSurveyCTOErrorMessages] = useState<
    string[]
  >([]);

  const [formFields, setFormFields] = useState<any>({
    form_uid: dq_form_uid || "",
    survey_status: null,
    revisit_section: null,
    target_id: null,
    enumerator_id: null,
    dq_enumerator_id: null,
    locations: {},
  });

  const loadFormQuestions = async (refresh = false) => {
    setIsQuestionLoading(true);
    setHasError(false);
    setSurveyCTOErrorMessages([]);
    const errorMessages: string[] = [];
    if (dq_form_uid != undefined) {
      const questionsRes = await dispatch(
        await getCTOFormQuestions({ formUid: dq_form_uid, refresh: refresh })
      );

      if (questionsRes.payload?.error) {
        setHasError(true);
        if (questionsRes.payload?.error.includes("ResourceNotFoundException")) {
          errorMessages.push(
            "The resource is not found. Either the SCTO server name is wrong, or access is not given."
          );
        } else if (questionsRes.payload?.error.includes("Client Error")) {
          errorMessages.push(
            "Either the SurveyCTO Form ID provided is wrong or access is not given."
          );
        } else {
          errorMessages.push(questionsRes.payload?.error);
        }
        setSurveyCTOErrorMessages(errorMessages);
      } else if (questionsRes.payload?.errors) {
        setHasError(true);
        // Check if the error message is an array
        if (Array.isArray(questionsRes.payload?.errors)) {
          questionsRes.payload?.errors.forEach(
            (error: string, index: number) => {
              errorMessages.push(error);
            }
          );
        } else {
          errorMessages.push("An unknown error occurred");
        }
        setSurveyCTOErrorMessages(errorMessages);
      }

      //dispatch twice if refresh
      if (refresh) {
        const refreshRes = await dispatch(
          getCTOFormQuestions({ formUid: dq_form_uid })
        );

        if (refreshRes.payload?.message) {
          setHasError(true);
          setSurveyCTOErrorMessages([
            'Could not find SCTO form questions, please click the "Load questions from SCTO" button to retry.',
          ]);
        }
      }
    } else {
      message.error(
        "Kindly check if the form_uid is provided on the url to proceed."
      );
    }
    setIsQuestionLoading(false);
  };

  const loadFormMappings = async () => {
    if (dq_form_uid != undefined) {
      if (Object.keys(defaultLocationFormat).length < 0) return;

      const res = await dispatch(getSCTOFormMapping(dq_form_uid));
      if (res.payload?.error) {
        setIsNewMapping(true);
        return;
      }

      if (res.payload) {
        setFormFields({
          form_uid: res.payload.form_uid,
          survey_status: null,
          revisit_section: null,
          target_id: res.payload.target_id,
          enumerator_id: res.payload.enumerator_id,
          dq_enumerator_id: res.payload.dq_enumerator_id,
          locations: res.payload.locations || defaultLocationFormat,
        });
      }
    } else {
      message.error(
        "Kindly check if the form_uid is provided on the url to proceed."
      );
    }
  };

  const handleFormSubmit = () => {
    // Extract all field values
    const fieldValues = [];
    for (const key in formFields) {
      if (key === "survey_status" || key === "revisit_section") continue;
      if (key === "locations") {
        for (const locationKey in formFields[key]) {
          fieldValues.push(formFields[key][locationKey]);
        }
        continue;
      }
      fieldValues.push(formFields[key]);
    }

    // Check if all required fields are filled
    if (fieldValues.includes(null) || fieldValues.includes(undefined)) {
      message.error("Please fill all the required fields");
      return;
    }

    // Check if all field's value are unique
    if (new Set(fieldValues).size !== fieldValues.length) {
      message.error("Please select unique questions for each field");
      return;
    }

    // Creating or updating SCTO form mapping
    if (isNewMapping) {
      dispatch(
        createSCTOFormMapping({
          formUID: dq_form_uid || "",
          data: formFields,
        })
      ).then((res) => {
        if (res.payload?.success) {
          message.success("SCTO form mapping created successfully.");
          navigate(`/module-configuration/dq-forms/${survey_uid}`);
        } else {
          message.error(res.payload?.message);
        }
      });
      return;
    } else {
      dispatch(
        updateSCTOFormMapping({
          formUID: dq_form_uid || "",
          data: formFields,
        })
      ).then((res) => {
        if (res.payload?.success) {
          message.success("SCTO form mapping updated successfully.");
          navigate(`/module-configuration/dq-forms/${survey_uid}`);
        } else {
          message.error(res.payload?.message);
        }
      });
    }
  };

  // Load surveyCTOForm and SurveyLocationGeoLevels on page load
  useEffect(() => {
    if (survey_uid) {
      dispatch(getSurveyCTOForm({ survey_uid }));
      dispatch(getSurveyLocationGeoLevels({ survey_uid }));
    }
  }, [dispatch, survey_uid]);

  // Load form surveyCTOQuestions on page load
  useEffect(() => {
    loadFormQuestions();
  }, [dq_form_uid]);

  // Load form surveyCTOMapping on page load
  useEffect(() => {
    loadFormMappings();
  }, [dq_form_uid, defaultLocationFormat]);

  // Populate question list options from surveyCTOQuestions
  useEffect(() => {
    if (surveyCTOQuestions && Object.keys(surveyCTOQuestions).length > 0) {
      const questionsArr = surveyCTOQuestions?.questions?.map(
        (question: any) => {
          return {
            label: question.question_name,
            value: question.question_name,
          };
        }
      );
      setQuestionList(questionsArr);
    } else {
      setQuestionList([]);
    }
  }, [surveyCTOQuestions]);

  // Populate location fields
  useEffect(() => {
    if (surveyLocationGeoLevels.length > 0) {
      const locations: { [key: string]: any } = {};
      surveyLocationGeoLevels.forEach((geoLevel: any, index: number) => {
        const idx = "location_" + (index + 1);
        locations[idx] = null;
      });
      setDefaultLocationFormat(locations);
      setFormFields({ ...formFields, location: locations });
    }
  }, [surveyLocationGeoLevels]);

  const isLoading =
    isSurveyCTOFormLoading ||
    isDQFormLoading ||
    isQuestionLoading ||
    isLoadingSurveyLocationGeoLevels;

  const renderQuestionsSelectArea = () => {
    if (isLoading) {
      return <FullScreenLoader />;
    }
    if (!isLoading && hasError) {
      return (
        <SCTOLoadErrorArea>
          <span
            style={{
              marginTop: "10px",
              marginBottom: "20px",
              display: "inline-block",
            }}
          >
            The SurveyCTO form definition could not be loaded due to the
            following errors:
          </span>
          {surveyCTOErrorMessages.map((error, index) => {
            const key = "uniqueKey" + index;
            return (
              <div key={key}>
                <Alert message={error} type="error" />
                <br />
              </div>
            );
          })}
        </SCTOLoadErrorArea>
      );
    }

    if (!isLoading && !hasError) {
      return (
        <div>
          <p style={{ marginTop: 36 }}>Questions to be mapped</p>
          <Row align="middle" style={{ marginBottom: 6, marginTop: 12 }}>
            <Col span={4}>
              <FormItemLabel>
                <span style={{ color: "red" }}>*</span> Target ID{" "}
                <Tooltip title="Select the variable that is used to track the Target ID.">
                  <QuestionCircleOutlined />
                </Tooltip>{" "}
                :
              </FormItemLabel>
            </Col>
            <Col span={5}>
              <Select
                style={{ width: "100%" }}
                placeholder="Select"
                value={formFields?.target_id}
                disabled={!canUserWrite}
                options={questionList}
                onChange={(value) =>
                  setFormFields({ ...formFields, target_id: value })
                }
                showSearch
                allowClear
              />
            </Col>
          </Row>
          <Row align="middle" style={{ marginBottom: 6, marginTop: 12 }}>
            <Col span={4}>
              <FormItemLabel>
                <span style={{ color: "red" }}>*</span> Enumerator ID{" "}
                <Tooltip title="Select the variable that is used to track the ID of the enumerator filling the data quality form.">
                  <QuestionCircleOutlined />
                </Tooltip>{" "}
                :
              </FormItemLabel>
            </Col>
            <Col span={5}>
              <Select
                style={{ width: "100%" }}
                placeholder="Select"
                value={formFields?.enumerator_id}
                disabled={!canUserWrite}
                options={questionList}
                onChange={(value) =>
                  setFormFields({ ...formFields, enumerator_id: value })
                }
                showSearch
                allowClear
              />
            </Col>
          </Row>
          <Row align="middle" style={{ marginBottom: 6, marginTop: 12 }}>
            <Col span={4}>
              <FormItemLabel>
                <span style={{ color: "red" }}>*</span> DQ enumerator ID{" "}
                <Tooltip title="Select the variable that is used to track the ID of the enumerator being checked in the data quality form.">
                  <QuestionCircleOutlined />
                </Tooltip>{" "}
                :
              </FormItemLabel>
            </Col>
            <Col span={5}>
              <Select
                style={{ width: "100%" }}
                placeholder="Select"
                value={formFields?.dq_enumerator_id}
                disabled={!canUserWrite}
                options={questionList}
                onChange={(value) =>
                  setFormFields({ ...formFields, dq_enumerator_id: value })
                }
                showSearch
                allowClear
              />
            </Col>
          </Row>
          {surveyLocationGeoLevels && surveyLocationGeoLevels.length > 0
            ? surveyLocationGeoLevels.map((geoLevel: any, idx) => (
                <Row
                  key={idx}
                  align="middle"
                  style={{ marginBottom: 6, marginTop: 12 }}
                >
                  <Col span={4}>
                    <FormItemLabel>
                      <span style={{ color: "red" }}>*</span>{" "}
                      {geoLevel.geo_level_name} ID{" "}
                      <Tooltip
                        title={
                          "Select the variable that is used to track the " +
                          geoLevel.geo_level_name +
                          " ID."
                        }
                      >
                        <QuestionCircleOutlined />
                      </Tooltip>{" "}
                      :
                    </FormItemLabel>
                  </Col>
                  <Col span={5}>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select"
                      value={
                        formFields?.locations &&
                        Object.keys(formFields?.locations).length > 0
                          ? formFields?.locations["location_" + (idx + 1)]
                          : ""
                      }
                      options={questionList}
                      disabled={!canUserWrite}
                      onChange={(value) => {
                        const updatedLocations = {
                          ...formFields?.locations,
                          ["location_" + (idx + 1)]: value,
                        };
                        setFormFields({
                          ...formFields,
                          locations: updatedLocations,
                        });
                      }}
                      showSearch
                      allowClear
                    />
                  </Col>
                </Row>
              ))
            : null}
          <Button
            onClick={() =>
              navigate(`/module-configuration/dq-forms/${survey_uid}`)
            }
          >
            Cancel
          </Button>
          <CustomBtn
            style={{ marginTop: 24, marginLeft: 20 }}
            onClick={handleFormSubmit}
            disabled={!canUserWrite}
          >
            Save
          </CustomBtn>
        </div>
      );
    }
  };

  return (
    <>
      <>
        <Container surveyPage={true} />
        <HeaderContainer>
          <Breadcrumb
            separator=">"
            style={{ fontSize: "16px", color: "#000" }}
            items={[
              {
                title: "Data Quality Forms",
                href: `/module-configuration/dq-forms/${survey_uid}`,
              },
              {
                title: "Form Details",
                href: `/module-configuration/dq-forms/${survey_uid}/manage?dq_form_uid=${dq_form_uid}`,
              },
              {
                title: "SurveyCTO Questions",
              },
            ]}
          />
          <CustomBtn
            onClick={() => loadFormQuestions(true)}
            disabled={!canUserWrite}
            style={{ marginLeft: "auto" }}
            loading={isQuestionLoading}
          >
            Load questions from SCTO form
          </CustomBtn>
        </HeaderContainer>
        {isLoading ? (
          <FullScreenLoader />
        ) : (
          <div style={{ display: "flex" }}>
            <SideMenu />
            <DQFormWrapper>
              <DescriptionText>
                This step has 3 pre-requisites:
                <ol>
                  <li>
                    Data Manager access to the SCTO server has been provided to
                    surveystream.devs@idinsight.org
                  </li>
                  <li>
                    You can see surveystream.devs@idinsight.org as an active
                    user on SCTO
                  </li>
                  <li>
                    The form ID shared will be the form used for data
                    collection, the form has been deployed, and the variable
                    names will not change.
                  </li>
                </ol>
              </DescriptionText>
              {renderQuestionsSelectArea()}
            </DQFormWrapper>
          </div>
        )}
      </>
    </>
  );
}

export default DQFormSCTOQuestion;
