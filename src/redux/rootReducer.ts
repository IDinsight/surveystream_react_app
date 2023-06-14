// rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import moduleStatusesReducer from "./moduleSelection/moduleStatusesSlice";
import modulesReducer from "./moduleSelection/modulesSlice";
import authReducer from "./auth/authSlice";
import surveysReducer from "./surveyList/surveysSlice";
import surveyConfigReducer from "./surveyConfig/surveyConfigSlice";
import fieldSupervisorRolesReducer from "./fieldSupervisorRoles/fieldSupervisorRolesSlice";
import surveyCTOInformationReducer from "./surveyCTOInformation/surveyCTOInformationSlice";
import surveyCTOQuestionsReducer from "./surveyCTOQuestions/surveyCTOQuestionsSlice";
import surveyLocationsReducer from "./surveyLocations/surveyLocationsSlice";

const rootReducer = combineReducers({
  moduleStatuses: moduleStatusesReducer,
  modules: modulesReducer,
  auth: authReducer,
  surveys: surveysReducer,
  surveyConfig: surveyConfigReducer,
  filedSupervisorRoles: fieldSupervisorRolesReducer,
  surveyCTOInformation: surveyCTOInformationReducer,
  surveyCTOQuestions: surveyCTOQuestionsReducer,
  surveyLocations: surveyLocationsReducer,
});

export default rootReducer;
