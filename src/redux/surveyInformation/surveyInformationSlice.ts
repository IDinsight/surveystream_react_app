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
    addSupervisorRole: (state, action) => {
      state.supervisorRoles.push(action.payload);
    },
    setSupervisorRoles: (state, action: PayloadAction<SupervisorRole[]>) => {
      state.supervisorRoles = action.payload;
    },

    getSupervisorRolesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSupervisorRolesSuccess: (
      state,
      action: PayloadAction<SupervisorRole[]>
    ) => {
      console.log("action.payload.length", action.payload);

      if (action.payload.length !== 0) {
        state.supervisorRoles = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    getSupervisorRolesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.supervisorRoles = [];
      state.error = action.payload;
    },

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
  getSupervisorRolesRequest,
  getSupervisorRolesFailure,
  getSupervisorRolesSuccess,
  postSupervisorRolesRequest,
  postSupervisorRolesSuccess,
  postSupervisorRolesFailure,
  addSupervisorRole,
  setSupervisorRoles,
} = surveyInformationSlice.actions;

export default surveyInformationSlice.reducer;
