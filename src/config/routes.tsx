import { Routes, Route, Navigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
import Login from "../modules/Auth";
import LandingPage from "../modules/LandingPage";
import SurveysHomePage from "../modules/SurveysHomePage";
import NewSurveyConfig from "../modules/NewSurveyConfig";
import ModuleSelection from "../modules/ModuleSelection";
import { useNavigate } from "react-router-dom";
import { ComponentType, ReactNode, useEffect, useState } from "react";
import { deleteAllCookies, getCookie } from "../utils/helper";

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
      <Route path="/surveys" element={requireAuth(SurveysHomePage)} />
      <Route
        path="/new-survey-config/:path?"
        element={requireAuth(NewSurveyConfig)}
      />
      <Route
        path="/module-selection/:survey_uid?"
        element={requireAuth(ModuleSelection)}
      />
    </SentryRoutes>
  );
};

export default AppRoutes;
