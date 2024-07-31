// rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import moduleStatusesReducer from "./moduleSelection/moduleStatusesSlice";
import modulesReducer from "./moduleSelection/modulesSlice";
import authReducer from "./auth/authSlice";
import surveysReducer from "./surveyList/surveysSlice";
import surveyConfigReducer from "./surveyConfig/surveyConfigSlice";
import userRolesReducer from "./userRoles/userRolesSlice";
import surveyCTOInformationReducer from "./surveyCTOInformation/surveyCTOInformationSlice";
import surveyCTOQuestionsReducer from "./surveyCTOQuestions/surveyCTOQuestionsSlice";
import surveyLocationsReducer from "./surveyLocations/surveyLocationsSlice";
import enumeratorsReducer from "./enumerators/enumeratorsSlice";
import targetsReducer from "./targets/targetSlice";
import userManagementReducer from "./userManagement/userManagementSlice";
import assignmentsReducer from "./assignments/assignmentsSlice";
import emailsReducer from "./emails/emailsSlice";
import targetStatusMappingReducer from "./targetStatusMapping/targetStatusMappingSlice";
import mediaAuditsReducer from "./mediaAudits/mediaAuditsSlice";
import dqFormsReducer from "./dqForm/dqFormSlice";
import tableConfigSlice from "./tableConfig/tableConfigSlice";

const rootReducer = combineReducers({
  moduleStatuses: moduleStatusesReducer,
  modules: modulesReducer,
  auth: authReducer,
  surveys: surveysReducer,
  surveyConfig: surveyConfigReducer,
  userRoles: userRolesReducer,
  surveyCTOInformation: surveyCTOInformationReducer,
  surveyCTOQuestions: surveyCTOQuestionsReducer,
  surveyLocations: surveyLocationsReducer,
  enumerators: enumeratorsReducer,
  targets: targetsReducer,
  userManagement: userManagementReducer,
  assignments: assignmentsReducer,
  emails: emailsReducer,
  targetStatusMapping: targetStatusMappingReducer,
  mediaAudits: mediaAuditsReducer,
  dqForms: dqFormsReducer,
  tableConfig: tableConfigSlice,
});

export default rootReducer;
