import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Container from "../../components/Layout/Container";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import NavItems from "../../components/NavItems";
import Header from "../../components/Header";
import { HeaderContainer, Title } from "../../shared/Nav.styled";
import { BodyContainer, CustomBtn } from "./Mapping.styled";
import MediaForm from "../../components/MediaForm";
import { RootState } from "../../redux/store";
import { userHasPermission } from "../../utils/helper";
import MappingCard from "../../components/MappingCard";

function MappingHome() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  if (!survey_uid) {
    navigate("/surveys");
  }

  const userProfile = useAppSelector((state: RootState) => state.auth.profile);
  const {
    loading: isMediaAuditsConfigLoading,
    mediaConfigs: mediaAuditsConfig,
  } = useAppSelector((state: RootState) => state.mediaAudits);

  const canUserWrite = userHasPermission(
    userProfile,
    survey_uid,
    "WRITE Media Files Config"
  );

  const addFormClickHandler = () => {
    navigate(`/module-configuration/media-audits/${survey_uid}/manage`);
  };

  useEffect(() => {
    if (survey_uid) {
      // Fetch the data
    }
  }, [dispatch, survey_uid]);

  return (
    <>
      <Header items={NavItems} />
      {isMediaAuditsConfigLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container />
          <HeaderContainer>
            <Title>Mapping</Title>
          </HeaderContainer>
          <BodyContainer>
            <div style={{ display: "flex" }}>
              <MappingCard
                title="Surveyors <> Supervisors"
                description="Surveyor to Supervisor mappings"
                mappingType="surveyor-supervisor"
                surveyUID={survey_uid}
              />
              <MappingCard
                title="Targets <> Supervisors"
                description="Target to Supervisor mappings"
                mappingType="target-supervisor"
                surveyUID={survey_uid}
              />
            </div>
          </BodyContainer>
        </>
      )}
    </>
  );
}

export default MappingHome;
