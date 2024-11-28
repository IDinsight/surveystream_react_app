import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { loading: boolean; stats: any } = {
  loading: false,
  stats: null,
};

const mappingSlice = createSlice({
  name: "mapping",
  initialState,
  reducers: {
    updateMappingStatsSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.stats = action.payload;
    },
  },
});

export const { updateMappingStatsSuccess } = mappingSlice.actions;

export default mappingSlice.reducer;
