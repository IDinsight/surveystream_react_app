import { Routes, Route, Navigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
import Login from "../modules/Auth/Login";
import LandingPage from "../modules/LandingPage";
import SurveysHomePage from "../modules/SurveysHomePage";
import NewSurveyConfig from "../modules/NewSurveyConfig";
import ModuleSelection from "../modules/ModuleSelection";
import { useNavigate } from "react-router-dom";
import { ComponentType, ReactNode, useEffect, useState } from "react";
import { deleteAllCookies, getCookie } from "../utils/helper";
import ForgotPassword from "../modules/Auth/ForgotPassword";
import ResetPassword from "../modules/Auth/ResetPassword";
import SurveyCTOQuestions from "../modules/SurveyInformation/SurveyCTOQuestions";

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const isAuthenticated = () => {
  // Return true if authenticated, false otherwise
  const rememberToken = getCookie("remember_token");
  return rememberToken !== "";
};

const requireAuth = (Component: ComponentType<any>): ReactNode => {
  const isAuthorized = isAuthenticated();
  const [redirectedFrom, setRedirectedFrom] = useState<string | null>(null);

  useEffect(() => {
    setRedirectedFrom(window.location.pathname);
  }, []);

  return isAuthorized ? (
    <Component />
  ) : (
    <Navigate to="/login" state={{ redirectedFrom }} replace />
  );
};

const AppRoutes = () => {
  const navigate = useNavigate();
  const isAuthorized = isAuthenticated();

  useEffect(() => {
    if (!isAuthorized && window.location.pathname !== "/login") {
      deleteAllCookies();
      navigate(`/login?redirectedFrom=${window.location.pathname}`, {
        replace: true,
      });
    }
  }, [isAuthorized, navigate]);

  return (
    <SentryRoutes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
      {/* this will default to the basic form if path is not defined */}
      <Route path="/surveys" element={requireAuth(SurveysHomePage)} />
      <Route
        path="/new-survey-config/:path?"
        element={requireAuth(NewSurveyConfig)}
      />
      <Route
        path="/module-selection/:survey_uid?"
        element={requireAuth(ModuleSelection)}
      />
      <Route
        path="/survey-information/survey-cto-questions"
        element={requireAuth(SurveyCTOQuestions)}
      />
    </SentryRoutes>
  );
};

export default AppRoutes;
