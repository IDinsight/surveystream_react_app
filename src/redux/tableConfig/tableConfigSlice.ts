import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  data: null,
  err: null,
};

const authSlice = createSlice({
  name: "tableConfig",
  initialState,
  reducers: {
    tableConfigRequest(state) {
      state.loading = true;
    },
    tableConfigSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
      state.data = action.payload;
    },
    tableConfigFailure(state, action: PayloadAction<any>) {
      state.loading = false;
      state.err = action.payload;
    },
  },
});

export const { tableConfigRequest, tableConfigSuccess, tableConfigFailure } =
  authSlice.actions;

export default authSlice.reducer;
