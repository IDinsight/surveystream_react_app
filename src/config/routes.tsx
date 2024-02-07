import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import * as Sentry from "@sentry/react";
import Login from "../modules/Auth/Login";
import LandingPage from "../modules/LandingPage";
import SurveysHomePage from "../modules/SurveysHomePage";
import NewSurveyConfig from "../modules/NewSurveyConfig";
import ModuleSelection from "../modules/ModuleSelection";
import { getCookie } from "../utils/helper";
import ForgotPassword from "../modules/Auth/ForgotPassword";
import ResetPassword from "../modules/Auth/ResetPassword";
import SurveyCTOQuestions from "../modules/SurveyInformation/SurveyCTOQuestions";
import SurveyCTOInfomation from "../modules/SurveyInformation/SurveyCTOInformation";
import SurveyConfiguration from "../modules/SurveyConfiguration";
import SurveyLocationAdd from "../modules/SurveyInformation/SurveyLocationAdd";
import SurveyLocationHierarchy from "../modules/SurveyInformation/SurveyLocationHierarchy";
import SurveyLocationUpload from "../modules/SurveyInformation/SurveyLocationUpload";
import EnumeratorsUpload from "../modules/SurveyInformation/Enumerators/EnumeratorsUpload";
import EnumeratorsMap from "../modules/SurveyInformation/Enumerators/EnumeratorsMap";
import NotFound from "../modules/NotFound";
import TargetsUpload from "../modules/SurveyInformation/Targets/TargetsUpload";
import TargetsMap from "../modules/SurveyInformation/Targets/TargetsMap";
import TargetsHome from "../modules/SurveyInformation/Targets";
import EnumeratorsHome from "../modules/SurveyInformation/Enumerators";
import CompleteRegistration from "../modules/Users/CompleteRegistration";
import AddUser from "../modules/Users/AddUser";
import ManageUsers from "../modules/Users/ManageUsers";
import EditUser from "../modules/Users/EditUser";
import Assignments from "../modules/Assignments/Assignments";
import CreateAssignments from "../modules/Assignments/AssignmentsTab/CreateAssignments/CreateAssignments";
import SurveyRoles from "../modules/SurveyInformation/SurveyUserRoles/SurveyRoles";
import SurveyUsers from "../modules/SurveyInformation/SurveyUserRoles/SurveyUsers";

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const isAuthenticated = () => {
  // Return true if authenticated, false otherwise
  const rememberToken = getCookie("remember_token");
  return rememberToken !== "";
};

const PrivateRoute = () => {
  const isAuthorized = isAuthenticated();
  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <SentryRoutes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
      <Route
        path="/complete-registration/:token"
        element={<CompleteRegistration />}
      />

      <Route element={<PrivateRoute />}>
        <Route path="/users" element={<ManageUsers />} />
        <Route path="/users/add" element={<AddUser />} />
        <Route path="/users/edit" element={<EditUser />} />

        <Route path="/surveys" element={<SurveysHomePage />} />
        <Route
          path="/survey-configuration/:survey_uid?"
          element={<SurveyConfiguration />}
        />
        <Route
          path="/new-survey-config/:survey_uid?"
          element={<NewSurveyConfig />}
        />
        <Route
          path="/module-selection/:survey_uid?"
          element={<ModuleSelection />}
        />
        <Route
          path="/survey-information/:survey_uid?"
          element={<SurveyCTOInfomation />}
        />
        <Route
          path="/survey-information/survey-roles/:path?/:survey_uid?/:role_uid?"
          element={<SurveyRoles />}
        />
        <Route
          path="/survey-information/survey-users/:path?/:survey_uid?"
          element={<SurveyUsers />}
        />
        <Route
          path="/survey-information/survey-cto-information/:survey_uid?"
          element={<SurveyCTOInfomation />}
        />
        <Route
          path="/survey-information/survey-cto-questions/:survey_uid?/:form_uid?"
          element={<SurveyCTOQuestions />}
        />
        <Route
          path="/survey-information/location/add/:survey_uid?"
          element={<SurveyLocationAdd />}
        />
        <Route
          path="/survey-information/location/hierarchy/:survey_uid?"
          element={<SurveyLocationHierarchy />}
        />
        <Route
          path="/survey-information/location/upload/:survey_uid?"
          element={<SurveyLocationUpload />}
        />
        <Route
          path="/survey-information/enumerators/:survey_uid?/:form_uid?"
          element={<EnumeratorsHome />}
        />
        <Route
          path="/survey-information/enumerators/upload/:survey_uid?/:form_uid?"
          element={<EnumeratorsUpload />}
        />
        <Route
          path="/survey-information/enumerators/map/:survey_uid?/:form_uid?"
          element={<EnumeratorsMap />}
        />
        <Route
          path="/survey-information/targets/:survey_uid?/:form_uid?"
          element={<TargetsHome />}
        />
        <Route
          path="/survey-information/targets/upload/:survey_uid?/:form_uid?"
          element={<TargetsUpload />}
        />
        <Route
          path="/survey-information/targets/map/:survey_uid?/:form_uid?"
          element={<TargetsMap />}
        />
        <Route
          path="/module-configuration/assignments/:survey_uid?/:form_uid?"
          element={<Assignments />}
        />
        <Route
          path="/module-configuration/assignments/:survey_uid?/:form_uid?/create"
          element={<CreateAssignments />}
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </SentryRoutes>
  );
};

export default AppRoutes;
