// rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import moduleStatusesReducer from "./moduleSelection/moduleStatusesSlice";
import modulesReducer from "./moduleSelection/modulesSlice";
import authReducer from "./auth/authSlice";
import surveysReducer from "./surveyList/surveysSlice";
import surveyConfigReducer from "./surveyConfig/surveyConfigSlice";
import surveyInformationReducer from "./surveyInformation/surveyInformationSlice";

const rootReducer = combineReducers({
  moduleStatuses: moduleStatusesReducer,
  modules: modulesReducer,
  auth: authReducer,
  surveys: surveysReducer,
  surveyConfig: surveyConfigReducer,
  surveyInformation: surveyInformationReducer,
});

export default rootReducer;
