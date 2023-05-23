// modulesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Module } from "./types";

interface ModulesState {
  loading: boolean;
  error: string | null;
  modules: Module[];
}
const initialState: ModulesState = {
  loading: false,
  error: null,
  modules: [],
};

const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    fetchModulesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchModulesSuccess: (state, action: PayloadAction<Module[]>) => {
      state.loading = false;
      state.modules = action.payload;
      state.error = null;
    },
    fetchModulesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.modules = [];
      state.error = action.payload;
    },
  },
});

export const { fetchModulesRequest, fetchModulesSuccess, fetchModulesFailure } =
  modulesSlice.actions;

export default modulesSlice.reducer;
