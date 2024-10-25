import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateMappingStatsSuccess } from "./mappingSlice";

export const updateMappingStats = createAsyncThunk(
  "mapping/updateMappingStats",
  async (data: any, { dispatch }) => {
    dispatch(updateMappingStatsSuccess(data));
  }
);

export const mappingActions = {
  updateMappingStats,
};
