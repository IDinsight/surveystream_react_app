import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Container from "../../components/Layout/Container";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import NavItems from "../../components/NavItems.OLD";
import Header from "../../components/Header.OLD";
import { HeaderContainer, Title } from "../../shared/Nav.styled";
import { BodyContainer, CustomBtn } from "./MediaAudits.styled";
import MediaForm from "../../components/MediaForm";
import { RootState } from "../../redux/store";
import { getMediaAuditsConfigs } from "../../redux/mediaAudits/mediaAuditsActions";
import { userHasPermission } from "../../utils/helper";

function MediaAuditsHome() {
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
      dispatch(getMediaAuditsConfigs({ survey_uid }));
    }
  }, [dispatch, survey_uid]);

  return (
    <>
      {/* <Header items={NavItems} /> */}
      {isMediaAuditsConfigLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container />
          <HeaderContainer>
            <Title>Media Audits Config</Title>
          </HeaderContainer>
          <BodyContainer>
            {mediaAuditsConfig.map((config: any) => (
              <MediaForm
                key={config.media_files_config_uid}
                data={config}
                editable={canUserWrite}
                surveyUID={survey_uid || ""}
              />
            ))}
            <CustomBtn
              style={{ marginTop: 24 }}
              disabled={!canUserWrite}
              onClick={addFormClickHandler}
            >
              Add Media Audit Config
            </CustomBtn>
          </BodyContainer>
        </>
      )}
    </>
  );
}

export default MediaAuditsHome;
