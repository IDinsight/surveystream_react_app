import { Routes, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";
import Login from "../modules/Auth/Login";
import LandingPage from "../modules/LandingPage";
import SurveysHomePage from "../modules/SurveysHomePage";
import NewSurveyConfig from "../modules/NewSurveyConfig";
import ForgotPassword from "../modules/Auth/ForgotPassword";
import ResetPassword from "../modules/Auth/ResetPassword";

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const AppRoutes = () => {
  return (
    <SentryRoutes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/surveys" element={<SurveysHomePage />} />
      <Route path="/reset-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
      {/* this will default to the basic form if path is not defined */}
      <Route path="/new-survey-config/:path?" element={<NewSurveyConfig />} />
    </SentryRoutes>
  );
};

export default AppRoutes;
