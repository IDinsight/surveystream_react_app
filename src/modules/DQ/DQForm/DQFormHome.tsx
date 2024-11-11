import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import Container from "../../../components/Layout/Container";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";

import { HeaderContainer, Title } from "../../../shared/Nav.styled";
import { BodyContainer, CustomBtn, DQFormWrapper } from "./DQForm.styled";
import { RootState } from "../../../redux/store";
import { getDQForms } from "../../../redux/dqForm/dqFormActions";
import DQFormCard from "../../../components/DQFormCard";
import { userHasPermission } from "../../../utils/helper";
import SideMenu from "./../SideMenu";

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

  const userProfile = useAppSelector((state: RootState) => state.auth.profile);
  const canUserWrite = userHasPermission(
    userProfile,
    survey_uid,
    "WRITE Data Quality Forms"
  );

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
      {isDQFormLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container />
          <HeaderContainer>
            <Title>Data quality forms</Title>
          </HeaderContainer>
          <div style={{ display: "flex" }}>
            <SideMenu></SideMenu>
            <DQFormWrapper>
              <p style={{ color: "#8C8C8C", fontSize: 14 }}>
                Please add all the data quality forms related to your survey
                here. These include audio audit forms, spot check forms, and
                back check forms.
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
            </DQFormWrapper>
          </div>
        </>
      )}
    </>
  );
}

export default DQFormHome;
