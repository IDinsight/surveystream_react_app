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
  assignableEnumerators: {
    loading: false,
    err: null,
    data: [],
  },
  targets: {
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
      state.assignments.data = action.payload;
    },
    assignmentsFailure(state, action: PayloadAction<any>) {
      state.assignments.loading = false;
      state.assignments.err = action.payload;
    },
    assignableEnumeratorsRequest(state) {
      state.assignableEnumerators.loading = true;
    },
    assignableEnumeratorsSuccess(state, action: PayloadAction<any>) {
      state.assignableEnumerators.loading = false;
      state.assignableEnumerators.data = action.payload;
    },
    assignableEnumeratorsFailure(state, action: PayloadAction<any>) {
      state.assignableEnumerators.loading = false;
      state.assignableEnumerators.err = action.payload;
    },
    targetsRequest(state) {
      state.targets.loading = true;
    },
    targetsSuccess(state, action: PayloadAction<any>) {
      state.targets.loading = false;
      state.targets.data = action.payload;
    },
    targetsFailure(state, action: PayloadAction<any>) {
      state.targets.loading = false;
      state.targets.err = action.payload;
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
  assignableEnumeratorsRequest,
  assignableEnumeratorsSuccess,
  assignableEnumeratorsFailure,
  targetsRequest,
  targetsSuccess,
  targetsFailure,
} = authSlice.actions;

export default authSlice.reducer;
