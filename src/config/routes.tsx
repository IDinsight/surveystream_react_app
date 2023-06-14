import { Routes, Route, Navigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
import Login from "../modules/Auth/Login";
import LandingPage from "../modules/LandingPage";
import SurveysHomePage from "../modules/SurveysHomePage";
import NewSurveyConfig from "../modules/NewSurveyConfig";
import ModuleSelection from "../modules/ModuleSelection";
import { ComponentType, ReactNode } from "react";
import { getCookie } from "../utils/helper";
import ForgotPassword from "../modules/Auth/ForgotPassword";
import ResetPassword from "../modules/Auth/ResetPassword";
import SurveyCTOQuestions from "../modules/SurveyInformation/SurveyCTOQuestions";
import SurveyCTOInfomation from "../modules/SurveyInformation/SurveyCTOInformation";
import SurveyConfiguration from "../modules/SurveyConfiguration";
import FieldSupervisorRoles from "../modules/SurveyInformation/FieldSupervisorRoles";
import SurveyLocationAdd from "../modules/SurveyInformation/SurveyLocationAdd";
import SurveyLocationHierarchy from "../modules/SurveyInformation/SurveyLocationHierarchy";
import SurveyLocationUpload from "../modules/SurveyInformation/SurveyLocationUpload";
import NotFound from "../modules/NotFound";

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const isAuthenticated = () => {
  // Return true if authenticated, false otherwise
  const rememberToken = getCookie("remember_token");
  return rememberToken !== "";
};

const requireAuth = (Component: ComponentType<any>): ReactNode => {
  const isAuthorized = isAuthenticated();
  return isAuthorized ? <Component /> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <SentryRoutes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
      <Route path="/surveys" element={requireAuth(SurveysHomePage)} />
      <Route
        path="/survey-configuration/:survey_uid?"
        element={requireAuth(SurveyConfiguration)}
      />

      <Route
        path="/new-survey-config/:survey_uid?"
        element={requireAuth(NewSurveyConfig)}
      />
      <Route
        path="/module-selection/:survey_uid?"
        element={requireAuth(ModuleSelection)}
      />
      <Route
        path="/survey-information/:survey_uid?"
        element={requireAuth(SurveyCTOInfomation)}
      />
      <Route
        path="/survey-information/survey-cto-information/:survey_uid?"
        element={requireAuth(SurveyCTOInfomation)}
      />
      <Route
        path="/survey-information/survey-cto-questions/:survey_uid?"
        element={requireAuth(SurveyCTOQuestions)}
      />
      <Route
        path="/survey-information/field-supervisor-roles/:path?/:survey_uid?"
        element={requireAuth(FieldSupervisorRoles)}
      />
      <Route
        path="/survey-information/location/add"
        element={requireAuth(SurveyLocationAdd)}
      />
      <Route
        path="/survey-information/location/hierarchy"
        element={requireAuth(SurveyLocationHierarchy)}
      />
      <Route
        path="/survey-information/location/upload"
        element={requireAuth(SurveyLocationUpload)}
      />
      <Route path="*" element={<NotFound />} />
    </SentryRoutes>
  );
};

export default AppRoutes;
