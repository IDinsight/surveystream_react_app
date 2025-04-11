import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import Container from "../../../components/Layout/Container";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";

import { HeaderContainer, Title } from "../../../shared/Nav.styled";
import { BodyContainer, CustomBtn } from "./AdminForm.styled";
import { RootState } from "../../../redux/store";
import { getAdminForms } from "../../../redux/adminForm/adminFormActions";
import AdminFormCard from "../../../components/AdminFormCard/AdminFormCard";
import { userHasPermission } from "../../../utils/helper";
import SideMenu from "../SideMenu";

function AdminFormHome() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  if (!survey_uid) {
    navigate("/surveys");
  }

  const { loading: isAdminFormLoading, adminForms } = useAppSelector(
    (state: RootState) => state.adminForms
  );

  const userProfile = useAppSelector((state: RootState) => state.auth.profile);
  const canUserWrite = userHasPermission(
    userProfile,
    survey_uid,
    "WRITE Admin Forms"
  );

  const addFormClickHandler = () => {
    navigate(`/survey-information/admin-forms/${survey_uid}/manage`);
  };

  useEffect(() => {
    if (survey_uid) {
      dispatch(getAdminForms({ survey_uid }));
    }
  }, [dispatch, survey_uid]);

  return (
    <>
      {isAdminFormLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container surveyPage={true} />
          <HeaderContainer>
            <Title>Admin Forms</Title>
            <CustomBtn
              style={{ marginLeft: "auto" }}
              disabled={!canUserWrite}
              onClick={addFormClickHandler}
            >
              Add admin form
            </CustomBtn>
          </HeaderContainer>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <BodyContainer>
              <p style={{ color: "#8C8C8C", fontSize: 14 }}>
                Please add the admin forms related to your survey here. These
                include bikelog forms and account details forms that you would
                like to use in other SurveyStream features.
              </p>
              {adminForms.map((adminForm: any) => (
                <AdminFormCard
                  key={adminForm.admin_form_uid}
                  data={adminForm}
                  editable={canUserWrite}
                  surveyUID={survey_uid || ""}
                />
              ))}
            </BodyContainer>
          </div>
        </>
      )}
    </>
  );
}

export default AdminFormHome;
