import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  tableConfig: {
    loading: false,
    data: {},
    err: null,
  },
};

const authSlice = createSlice({
  name: "tableConfig",
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
  },
});

export const { tableConfigRequest, tableConfigSuccess, tableConfigFailure } =
  authSlice.actions;

export default authSlice.reducer;
