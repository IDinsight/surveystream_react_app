// moduleActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Module } from "./types";
import * as api from "./apiService";

export const fetchModules = createAsyncThunk(
  "modules/fetchModules",
  async (_, { rejectWithValue }) => {
    try {
      const modules = await api.fetchModules();
      console.log("modules", modules);
      return modules as Module[];
    } catch (error) {
      return rejectWithValue(error as string);
    }
  }
);

export const moduleActions = {
  fetchModules,
};
