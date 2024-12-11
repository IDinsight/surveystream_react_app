import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AssignmentsState } from "./types";

const initialState: AssignmentsState = {
  tableConfig: {
    loading: false,
    data: {},
    err: null,
  },
  assignments: {
    loading: false,
    err: null,
    data: [],
  },
  assignmentEnumerators: {
    loading: false,
    err: null,
    data: [],
  },
  assignmentTargets: {
    loading: false,
    err: null,
    data: [],
  },
};

const authSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    tableConfigRequest(state) {
      state.tableConfig.loading = true;
    },
    tableConfigSuccess(state, action: PayloadAction<any>) {
      state.tableConfig.loading = false;
      state.tableConfig.data = action.payload;
    },
    tableConfigFailure(state, action: PayloadAction<any>) {
      state.tableConfig.loading = false;
      state.tableConfig.err = action.payload;
    },
    assignmentsRequest(state) {
      state.assignments.loading = true;
    },
    assignmentsSuccess(state, action: PayloadAction<any>) {
      state.assignments.loading = false;
      state.assignments.err = null;
      state.assignments.data = action.payload;
    },
    assignmentsFailure(state, action: PayloadAction<any>) {
      state.assignments.loading = false;
      state.assignments.err = action.payload;
      state.assignments.data = [];
    },
    assignmentEnumeratorsRequest(state) {
      state.assignmentEnumerators.loading = true;
    },
    assignmentEnumeratorsSuccess(state, action: PayloadAction<any>) {
      state.assignmentEnumerators.loading = false;
      state.assignmentEnumerators.data = action.payload;
    },
    assignmentEnumeratorsFailure(state, action: PayloadAction<any>) {
      state.assignmentEnumerators.loading = false;
      state.assignmentEnumerators.err = action.payload;
      state.assignmentEnumerators.data = [];
    },
    assignmentTargetsRequest(state) {
      state.assignmentTargets.loading = true;
    },
    assignmentTargetsSuccess(state, action: PayloadAction<any>) {
      state.assignmentTargets.loading = false;
      state.assignmentTargets.data = action.payload;
    },
    assignmentTargetsFailure(state, action: PayloadAction<any>) {
      state.assignmentTargets.loading = false;
      state.assignmentTargets.err = action.payload;
      state.assignmentTargets.data = [];
    },
    uploadAssignmentsRequest(state) {
      state.assignments.loading = true;
    },
    uploadAssignmentsSuccess(state, action: PayloadAction<any>) {
      state.assignments.loading = false;
    },
    uploadAssignmentsFailure(state, action: PayloadAction<any>) {
      state.assignments.loading = false;
    },
  },
});

export const {
  tableConfigRequest,
  tableConfigSuccess,
  tableConfigFailure,
  assignmentsRequest,
  assignmentsSuccess,
  assignmentsFailure,
  assignmentEnumeratorsRequest,
  assignmentEnumeratorsSuccess,
  assignmentEnumeratorsFailure,
  assignmentTargetsRequest,
  assignmentTargetsSuccess,
  assignmentTargetsFailure,
  uploadAssignmentsRequest,
  uploadAssignmentsSuccess,
  uploadAssignmentsFailure,
} = authSlice.actions;

export default authSlice.reducer;
