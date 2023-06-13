// rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import moduleStatusesReducer from "./moduleSelection/moduleStatusesSlice";
import modulesReducer from "./moduleSelection/modulesSlice";
import authReducer from "./auth/authSlice";
import surveysReducer from "./surveyList/surveysSlice";
import surveyConfigReducer from "./surveyConfig/surveyConfigSlice";
import fieldSupevisorRolesReducer from "./fiedSupervisorRoles/fieldSupervisorRolesSlice";
import surveyCTOInformationReducer from "./surveyCTOInformation/surveyCTOInformationSlice";

const rootReducer = combineReducers({
  moduleStatuses: moduleStatusesReducer,
  modules: modulesReducer,
  auth: authReducer,
  surveys: surveysReducer,
  surveyConfig: surveyConfigReducer,
  filedSupervisorRoles: fieldSupevisorRolesReducer,
  surveyCTOInformation: surveyCTOInformationReducer,
});

export default rootReducer;
