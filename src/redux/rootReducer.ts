// rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import moduleStatusesReducer from "./moduleSelection/moduleStatusesSlice";
import modulesReducer from "./moduleSelection/modulesSlice";
import authReducer from "./auth/authSlice";
import surveysReducer from "./surveyList/surveysSlice";

const rootReducer = combineReducers({
  moduleStatuses: moduleStatusesReducer,
  modules: modulesReducer,
  auth: authReducer,
  surveys: surveysReducer,
});

export default rootReducer;
