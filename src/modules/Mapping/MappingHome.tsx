import { useNavigate, useParams } from "react-router-dom";
import Container from "../../components/Layout/Container";
import { HeaderContainer, Title } from "../../shared/Nav.styled";
import { BodyContainer } from "./Mapping.styled";
import MappingCard from "../../components/MappingCard";

function MappingHome() {
  const navigate = useNavigate();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  if (!survey_uid) {
    navigate("/surveys");
  }

  return (
    <>
      <Container surveyPage={true} />
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
  );
}

export default MappingHome;
