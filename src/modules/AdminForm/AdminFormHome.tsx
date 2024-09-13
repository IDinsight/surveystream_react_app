import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Container from "../../components/Layout/Container";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import NavItems from "../../components/NavItems";
import Header from "../../components/Header.OLD";
import { HeaderContainer, Title } from "../../shared/Nav.styled";
import { BodyContainer, CustomBtn } from "./AdminForm.styled";
import { RootState } from "../../redux/store";
import { getAdminForms } from "../../redux/adminForm/adminFormActions";
import AdminFormCard from "../../components/AdminFormCard/AdminFormCard";
import { userHasPermission } from "../../utils/helper";

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
    navigate(`/module-configuration/admin-forms/${survey_uid}/manage`);
  };

  useEffect(() => {
    if (survey_uid) {
      dispatch(getAdminForms({ survey_uid }));
    }
  }, [dispatch, survey_uid]);

  return (
    <>
      {/* <Header items={NavItems} /> */}
      {isAdminFormLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container />
          <HeaderContainer>
            <Title>Admin forms</Title>
          </HeaderContainer>
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
            <CustomBtn
              style={{ marginTop: 24 }}
              disabled={!canUserWrite}
              onClick={addFormClickHandler}
            >
              Add Admin form
            </CustomBtn>
          </BodyContainer>
        </>
      )}
    </>
  );
}

export default AdminFormHome;
