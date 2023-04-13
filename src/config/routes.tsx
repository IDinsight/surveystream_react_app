import { Routes, Route } from "react-router-dom";
import Login from "../modules/Auth";
import LandingPage from "../modules/LandingPage";
import NewSurveyConfig from "../modules/NewSurveyConfig";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      {/* this will default to the basic form if path is not defined */}
      <Route path="/new_survey_config/:path?" element={<NewSurveyConfig />} />
    </Routes>
  );
};

export default AppRoutes;
