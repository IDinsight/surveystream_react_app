import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TargetStatusMappingState } from "./types";

const initialState: TargetStatusMappingState = {
  loading: false,
  error: null,
  mappingConfig: [],
};

const targetsSlice = createSlice({
  name: "targetStatusMapping",
  initialState,
  reducers: {
    getTargetStatusMappingRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getTargetStatusMappingSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.mappingConfig = action.payload.data;
    },
    getTargetStatusMappingFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.mappingConfig = null;
    },

    updateTargetStatusMappingRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateTargetStatusMappingSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    updateTargetStatusMappingFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getTargetStatusMappingRequest,
  getTargetStatusMappingSuccess,
  getTargetStatusMappingFailure,
  updateTargetStatusMappingRequest,
  updateTargetStatusMappingSuccess,
  updateTargetStatusMappingFailure,
} = targetsSlice.actions;

export default targetsSlice.reducer;
