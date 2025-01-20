import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DQChecksState } from "./types";

const initialState: DQChecksState = {
  loading: false,
  error: null,
  checkTypes: [],
  dqConfig: {},
};

const dqChecksSlice = createSlice({
  name: "dqChecks",
  initialState,
  reducers: {
    getDQCheckTypesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getDQCheckTypesSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.checkTypes = action.payload;
    },
    getDQCheckTypesFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.checkTypes = [];
    },
    getDQConfigRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getDQConfigSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.dqConfig = action.payload;
    },
    getDQConfigFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.dqConfig = null;
    },
    updateDQConfigRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateDQConfigSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    updateDQConfigFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getDQCheckTypesRequest,
  getDQCheckTypesSuccess,
  getDQCheckTypesFailure,
  getDQConfigRequest,
  getDQConfigSuccess,
  getDQConfigFailure,
  updateDQConfigRequest,
  updateDQConfigSuccess,
  updateDQConfigFailure,
} = dqChecksSlice.actions;

export default dqChecksSlice.reducer;
