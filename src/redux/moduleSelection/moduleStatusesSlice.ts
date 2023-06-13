// moduleStatusesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModuleStatus } from "./types";

interface ModuleStatusesState {
  loading: boolean;
  moduleStatuses: ModuleStatus[];
  error: string | null;
}

const initialState: ModuleStatusesState = {
  loading: false,
  moduleStatuses: [],
  error: null,
};

const moduleStatusesSlice = createSlice({
  name: "moduleStatuses",
  initialState,
  reducers: {
    fetchModuleStatusesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchModuleStatusesSuccess: (
      state,
      action: PayloadAction<ModuleStatus[]>
    ) => {
      state.loading = false;
      state.moduleStatuses = action.payload;
      state.error = null;
    },
    fetchModuleStatusesFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.moduleStatuses = [];
      state.error = action.payload;
    },
    createModuleStatusRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createModuleStatusSuccess: (
      state,
      action: PayloadAction<ModuleStatus[]>
    ) => {
      state.loading = false;
      state.error = null;
    },
    createModuleStatusFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchModuleStatusesRequest,
  fetchModuleStatusesSuccess,
  fetchModuleStatusesFailure,
  createModuleStatusRequest,
  createModuleStatusSuccess,
  createModuleStatusFailure,
} = moduleStatusesSlice.actions;

export default moduleStatusesSlice.reducer;
