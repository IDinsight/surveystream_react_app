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
import MediaForm from "../../components/MediaForm";
import { RootState } from "../../redux/store";
import { getMediaAuditsConfigs } from "../../redux/mediaAudits/mediaAuditsActions";

function MediaAuditsHome() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  const {
    loading: isMediaAuditsConfigLoading,
    mediaConfigs: mediaAuditsConfig,
  } = useAppSelector((state: RootState) => state.mediaAudits);

  const addFormClickHandler = () => {
    navigate(`/module-configuration/media-audits/${survey_uid}/manage`);
  };

  useEffect(() => {
    if (!survey_uid) {
      navigate("/surveys");
    } else {
      dispatch(getMediaAuditsConfigs({ survey_uid }));
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
            <Title>Media Audits Config</Title>
          </HeaderContainer>
          <BodyContainer>
            {mediaAuditsConfig.map((config: any) => (
              <MediaForm key={config.media_files_config_uid} data={config} />
            ))}
            <CustomBtn style={{ marginTop: 24 }} onClick={addFormClickHandler}>
              Add Media Audit form
            </CustomBtn>
          </BodyContainer>
        </>
      )}
    </>
  );
}

export default MediaAuditsHome;
