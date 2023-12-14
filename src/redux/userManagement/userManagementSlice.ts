import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserRolesState {
  loading: boolean;
  error: any;
  userChecked: any;
  userList: any;
  newUser: any;
}

const initialState: UserRolesState = {
  loading: false,
  error: null,
  userChecked: null,
  userList: [],
  newUser: null,
};

const userMaanagementSlice = createSlice({
  name: "userManagement",
  initialState,
  reducers: {
    checkUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    checkUserSuccess: (state, action: PayloadAction<[]>) => {
      if (action.payload.length !== 0) {
        state.userChecked = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    checkUserFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.userChecked = null;
      state.error = action.payload;
    },
    getAllUsersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getAllUsersSuccess: (state, action: PayloadAction<[]>) => {
      if (action.payload.length !== 0) {
        state.userList = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    getAllUsersFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.userList = null;
      state.error = action.payload;
    },

    postNewUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    postNewUserSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.newUser = action.payload;
      state.error = null;
    },
    postNewUserFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    postCompleteRegistrationRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    postCompleteRegistrationSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    postCompleteRegistrationFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  checkUserFailure,
  checkUserRequest,
  checkUserSuccess,
  getAllUsersFailure,
  getAllUsersRequest,
  getAllUsersSuccess,
  postNewUserFailure,
  postNewUserRequest,
  postNewUserSuccess,
  postCompleteRegistrationFailure,
  postCompleteRegistrationRequest,
  postCompleteRegistrationSuccess,
} = userMaanagementSlice.actions;

export default userMaanagementSlice.reducer;
