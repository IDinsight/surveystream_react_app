import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Container from "../../components/Layout/Container";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import NavItems from "../../components/NavItems";
import Header from "../../components/Header";
import { HeaderContainer } from "../Assignments/Assignments.styled";
import { Title } from "../../shared/Nav.styled";
import { BodyContainer, CustomBtn } from "./DQForm.styled";
import { RootState } from "../../redux/store";
import { getDQForms } from "../../redux/dqForm/dqFormActions";
import DQFormCard from "../../components/DQFormCard";

function DQFormHome() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  if (!survey_uid) {
    navigate("/surveys");
  }

  const { loading: isDQFormLoading, dqForms } = useAppSelector(
    (state: RootState) => state.dqForms
  );

  // TODO: Add user permission check
  const canUserWrite = true;

  const addFormClickHandler = () => {
    navigate(`/module-configuration/dq-forms/${survey_uid}/manage`);
  };

  useEffect(() => {
    if (survey_uid) {
      dispatch(getDQForms({ survey_uid }));
    }
  }, [dispatch, survey_uid]);

  return (
    <>
      <Header items={NavItems} />
      {isDQFormLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container />
          <HeaderContainer>
            <Title>Data quality forms</Title>
          </HeaderContainer>
          <BodyContainer>
            <p style={{ color: "#8C8C8C", fontSize: 14 }}>
              Please add all the data quality forms related to your survey here.
              These include audio audit forms, spot check forms, and back check
              forms.
            </p>
            {dqForms.map((dqForm: any) => (
              <DQFormCard
                key={dqForm.dq_form_uid}
                data={dqForm}
                editable={canUserWrite}
                surveyUID={survey_uid || ""}
              />
            ))}
            <CustomBtn
              style={{ marginTop: 24 }}
              disabled={!canUserWrite}
              onClick={addFormClickHandler}
            >
              Add data quality form
            </CustomBtn>
          </BodyContainer>
        </>
      )}
    </>
  );
}

export default DQFormHome;
