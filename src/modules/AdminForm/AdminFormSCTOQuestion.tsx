import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Container from "../../components/Layout/Container";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";

import { HeaderContainer } from "../../shared/Nav.styled";
import {
  BodyContainer,
  CustomBtn,
  DescriptionText,
  FormItemLabel,
  SCTOLoadErrorArea,
} from "./AdminForm.styled";
import { getSurveyCTOForm } from "../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { RootState } from "../../redux/store";
import { Button, Col, Row, Select, Tooltip, message, Alert } from "antd";
import { getCTOFormQuestions } from "../../redux/surveyCTOQuestions/surveyCTOQuestionsActions";
import { userHasPermission } from "../../utils/helper";
import {
  getAdminForm,
  createSCTOFormMapping,
  getSCTOFormMapping,
  updateSCTOFormMapping,
} from "../../redux/adminForm/adminFormActions";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";

function AdminFormSCTOQuestion() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  const { admin_form_uid } = useParams<{ admin_form_uid?: string }>() ?? {
    admin_form_uid: "",
  };

  if (!survey_uid || !admin_form_uid) {
    navigate("/surveys");
  }

  const userProfile = useAppSelector((state: RootState) => state.auth.profile);
  const canUserWrite = userHasPermission(
    userProfile,
    survey_uid,
    "WRITE Admin Forms"
  );

  const { loading: isSurveyCTOFormLoading, surveyCTOForm } = useAppSelector(
    (state: RootState) => state.surveyCTOInformation
  );

  const surveyCTOQuestions = useAppSelector(
    (state: RootState) => state.surveyCTOQuestions.surveyCTOQuestions
  );

  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [isNewMapping, setIsNewMapping] = useState<boolean>(false);
  const [formIdName, setFormIdName] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [isFormNameLoading, setIsFormNameLoading] = useState<boolean>(false);

  const [surveyCTOErrorMessages, setSurveyCTOErrorMessages] = useState<
    string[]
  >([]);

  const [formFields, setFormFields] = useState<any>({
    form_uid: admin_form_uid || "",
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
    if (admin_form_uid !== undefined) {
      const questionsRes = await dispatch(
        await getCTOFormQuestions({ formUid: admin_form_uid, refresh: refresh })
      );

      if (questionsRes.payload?.error) {
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
        setHasError(true);
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
          getCTOFormQuestions({ formUid: admin_form_uid })
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
    if (admin_form_uid != undefined) {
      const res = await dispatch(getSCTOFormMapping(admin_form_uid));
      if (res.payload?.error) {
        setIsNewMapping(true);
        return;
      }

      if (res.payload) {
        setFormFields({
          form_uid: res.payload.form_uid,
          survey_status: null,
          revisit_section: null,
          target_id: null,
          enumerator_id: res.payload.enumerator_id,
          dq_enumerator_id: null,
          locations: null,
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
      if (
        key === "survey_status" ||
        key === "revisit_section" ||
        key === "locations" ||
        key === "target_id" ||
        key === "dq_enumerator_id"
      )
        continue;
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
          formUID: admin_form_uid || "",
          data: formFields,
        })
      ).then((res) => {
        if (res.payload?.success) {
          message.success("SCTO form mapping created successfully.");
          navigate(`/module-configuration/admin-forms/${survey_uid}`);
        } else {
          message.error(res.payload?.message);
        }
      });
      return;
    } else {
      dispatch(
        updateSCTOFormMapping({
          formUID: admin_form_uid || "",
          data: formFields,
        })
      ).then((res) => {
        if (res.payload?.success) {
          message.success("SCTO form mapping updated successfully.");
          navigate(`/module-configuration/admin-forms/${survey_uid}`);
        } else {
          message.error(res.payload?.message);
        }
      });
    }
  };

  // Load surveyCTOForm on page load
  useEffect(() => {
    if (survey_uid) {
      dispatch(getSurveyCTOForm({ survey_uid }));
    }
  }, [dispatch, survey_uid]);

  //Fetch form name on page load
  useEffect(() => {
    if (admin_form_uid) {
      setIsFormNameLoading(true);
      dispatch(getAdminForm({ form_uid: admin_form_uid })).then((res) => {
        if (res.payload?.success) {
          setFormIdName(res.payload?.data.scto_form_id);
          setIsFormNameLoading(false);
        } else {
          message.error("Something went wrong!");
        }
      });
    }
  }, [admin_form_uid]);

  // Load form surveyCTOQuestions on page load
  useEffect(() => {
    loadFormQuestions();
  }, [admin_form_uid]);

  // Load form surveyCTOMapping on page load
  useEffect(() => {
    loadFormMappings();
  }, [admin_form_uid]);

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

  const isLoading = isSurveyCTOFormLoading || isQuestionLoading;

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

    if (!hasError && !isLoading) {
      return (
        <div>
          <p style={{ marginTop: 36 }}>Questions to be mapped</p>
          <Row align="middle" style={{ marginBottom: 6, marginTop: 12 }}>
            <Col span={4}>
              <FormItemLabel>
                <span style={{ color: "red" }}>*</span> Enumerator ID{" "}
                <Tooltip title="Select the variable that is used to track the ID of the enumerator.">
                  <QuestionCircleOutlined />
                </Tooltip>{" "}
                :
              </FormItemLabel>
            </Col>
            <Col span={5}>
              <Select
                style={{ width: "100%" }}
                placeholder="Select"
                value={formFields.enumerator_id}
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
          <Button
            style={{}}
            onClick={() =>
              navigate(`/module-configuration/admin-forms/${survey_uid}`)
            }
          >
            Cancel
          </Button>
          <CustomBtn
            style={{ marginLeft: 20, marginTop: 24 }}
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
          {/* <Title>Admin forms - SurveyCTO Questions</Title> */}
          <Breadcrumb
            separator=">"
            style={{ fontSize: "16px", color: "#000" }}
            items={[
              {
                title: "Admin forms",
                href: `/module-configuration/admin-forms/${survey_uid}`,
              },
              {
                title: "Form details",
                href: `/module-configuration/admin-forms/${survey_uid}/manage?admin_form_uid=${admin_form_uid}`,
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
        {isFormNameLoading ? (
          <FullScreenLoader />
        ) : (
          <BodyContainer>
            <p>Form ID: {formIdName}</p>
            <DescriptionText>
              This step has 3 pre-requisites:
              <ol>
                <li>
                  Data Manager access to the SCTO server has been provided to
                  surveystream.devs@idinsight.org
                </li>
                <li>
                  You can see surveystream.devs@idinsight.org as an active user
                  on SCTO
                </li>
                <li>
                  The form ID shared will be the form used for data collection,
                  the form has been deployed, and the variable names will not
                  change.
                </li>
              </ol>
            </DescriptionText>
            {renderQuestionsSelectArea()}
          </BodyContainer>
        )}
      </>
    </>
  );
}

export default AdminFormSCTOQuestion;
