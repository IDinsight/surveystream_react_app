// rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import moduleStatusesReducer from "./moduleSelection/moduleStatusesSlice";
import modulesReducer from "./moduleSelection/modulesSlice";
import authReducer from "./auth/authSlice";

const rootReducer = combineReducers({
  moduleStatuses: moduleStatusesReducer,
  modules: modulesReducer,
  auth: authReducer,
});

export default rootReducer;
