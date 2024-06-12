import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Container from "../../components/Layout/Container";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import NavItems from "../../components/NavItems";
import Header from "../../components/Header";
import { HeaderContainer } from "../Assignments/Assignments.styled";
import { Title } from "../../shared/Nav.styled";
import { BodyContainer, CustomBtn } from "./MediaAudits.styled";
import { getSurveyCTOForm } from "../../redux/surveyCTOInformation/surveyCTOInformationActions";
import MediaForm from "../../components/MediaForm";
import { RootState } from "../../redux/store";
import { getSurveyBasicInformation } from "../../redux/surveyConfig/surveyConfigActions";

function MediaAuditsHome() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  const { loading: isSurveyCTOFormLoading, surveyCTOForm } = useAppSelector(
    (state: RootState) => state.surveyCTOInformation
  );
  const { loading: isBasicInfoLoading, basicInfo } = useAppSelector(
    (state: RootState) => state.surveyConfig
  );

  const sctoFormId = surveyCTOForm?.scto_form_id;

  // if (!isSurveyCTOFormLoading && !sctoFormId) {
  //   message.error("No Survey CTO Information found for this survey");
  // }

  const mediaForms = [
    {
      form_name: "Audio audit form 1",
      scto_main_form_id: sctoFormId,
      scto_media_form_id: basicInfo?.survey_id + "_audit_form_1",
    },
  ];

  useEffect(() => {
    if (!survey_uid) {
      navigate("/surveys");
    }

    dispatch(getSurveyCTOForm({ survey_uid: survey_uid }));
    dispatch(getSurveyBasicInformation({ survey_uid: survey_uid }));
  }, [dispatch, survey_uid]);

  const isLoading = isBasicInfoLoading || isSurveyCTOFormLoading;

  return (
    <>
      <Header items={NavItems} />
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container />
          <HeaderContainer>
            <Title>Audio audits config</Title>
          </HeaderContainer>
          <BodyContainer>
            {mediaForms.map((form) => (
              <MediaForm key={form.form_name} data={form} />
            ))}
            <CustomBtn style={{ marginTop: 24 }}>
              Add audio audit form
            </CustomBtn>
          </BodyContainer>
        </>
      )}
    </>
  );
}

export default MediaAuditsHome;
