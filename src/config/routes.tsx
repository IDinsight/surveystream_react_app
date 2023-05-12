import { Routes, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";
import Login from "../modules/Auth";
import LandingPage from "../modules/LandingPage";
import SurveysHomePage from "../modules/SurveysHomePage";
import NewSurveyConfig from "../modules/NewSurveyConfig";
import ModuleSelection from "../modules/ModuleSelection";

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const AppRoutes = () => {
  return (
    <SentryRoutes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/surveys" element={<SurveysHomePage />} />
      {/* this will default to the basic form if path is not defined */}
      <Route path="/new-survey-config/:path?" element={<NewSurveyConfig />} />
      <Route
        path="/module-selection/:survey_uid?"
        element={<ModuleSelection />}
      />
    </Routes>
  );
};

export default AppRoutes;
