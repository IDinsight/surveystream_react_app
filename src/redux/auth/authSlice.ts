import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  loading: boolean;
  profile: any;
  err: string | null;
  updateLoading: boolean;
  updateRes: any;
  updateErr: string | null;
}

const initialState: AuthState = {
  loading: false,
  err: null,
  profile: {},
  updateLoading: false,
  updateRes: null,
  updateErr: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    profileRequest(state) {
      state.updateLoading = true;
    },
    profileSuccess(state, action: PayloadAction<any>) {
      state.updateLoading = false;
      state.profile = action.payload;
    },
    profileFailure(state, action: PayloadAction<string>) {
      state.updateLoading = false;
      state.profile = {};
      state.updateErr = action.payload;
    },
    loginRequest(state) {
      state.updateLoading = true;
    },
    loginSuccess(state, action: PayloadAction<any>) {
      state.updateLoading = false;
      state.updateRes = action.payload;
      state.profile = action.payload.profile;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.updateLoading = false;
      state.updateRes = false;
      state.updateErr = action.payload;
    },
    logoutRequest(state) {
      state.loading = true;
    },
    logoutSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
      state.updateRes = action.payload;
      state.err = null;
      state.profile = {};
    },
    logoutFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.updateRes = false;
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
  profileFailure,
  profileSuccess,
  profileRequest,
} = authSlice.actions;

export default authSlice.reducer;
