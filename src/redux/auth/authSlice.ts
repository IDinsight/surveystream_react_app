import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  loading: boolean;
  data: any;
  err: string | null;
  updateLoading: boolean;
  updateRes: any;
  updateErr: string | null;
}

const initialState: AuthState = {
  loading: false,
  data: null,
  err: null,
  updateLoading: false,
  updateRes: null,
  updateErr: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest(state) {
      state.updateLoading = true;
    },
    loginSuccess(state, action: PayloadAction<any>) {
      state.updateLoading = false;
      state.updateRes = action.payload;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.updateLoading = false;
      state.updateRes = false;
      state.updateErr = action.payload;
    },
    logoutRequest(state) {
      state.loading = true;
    },
    logoutSuccess(state) {
      state.loading = false;
      state.data = true;
      state.err = null;
    },
    logoutFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.data = false;
      state.err = action.payload;
    },
    loginDefault(state) {
      state.updateRes = false;
      state.updateErr = null;
      state.updateLoading = false;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  loginDefault,
} = authSlice.actions;

export default authSlice.reducer;
