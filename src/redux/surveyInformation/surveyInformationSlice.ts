import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SupervisorRole } from "./types";

interface SurveyInformationState {
  loading: boolean;
  error: any;
  supervisorRoles: SupervisorRole[];
}

const initialState: SurveyInformationState = {
  loading: false,
  error: null,
  supervisorRoles: [],
};

const surveyInformationSlice = createSlice({
  name: "surveyInformation",
  initialState,
  reducers: {
    postSupervisorRolesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    postSupervisorRolesSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    postSupervisorRolesFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  postSupervisorRolesRequest,
  postSupervisorRolesSuccess,
  postSupervisorRolesFailure,
} = surveyInformationSlice.actions;

export default surveyInformationSlice.reducer;
