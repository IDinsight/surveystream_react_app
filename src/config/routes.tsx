import { Routes, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";
import Login from "../modules/Auth";
import LandingPage from "../modules/LandingPage";
import SurveysHomePage from "../modules/SurveysHomePage";
import NewSurveyConfig from "../modules/NewSurveyConfig";

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const AppRoutes = () => {
  return (
    <SentryRoutes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/surveys" element={<SurveysHomePage />} />
      {/* this will default to the basic form if path is not defined */}
      <Route path="/new_survey_config/:path?" element={<NewSurveyConfig />} />
    </SentryRoutes>
  );
};

export default AppRoutes;
