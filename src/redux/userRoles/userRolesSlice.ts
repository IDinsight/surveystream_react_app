import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RolePermissions, SupervisorRole } from "./types";

interface UserRolesState {
  loading: boolean;
  error: any;
  supervisorRoles: SupervisorRole[];
  allPermissions: any[];
  rolePermissions: RolePermissions;
  userHierarchy: any;
}

const initialState: UserRolesState = {
  loading: false,
  error: null,
  supervisorRoles: [],
  allPermissions: [],
  rolePermissions: {
    role_uid: null,
    survey_uid: null,
    permissions: [],
    duplicate: false,
  },
  userHierarchy: {
    user_uid: null,
    survey_uid: null,
    parent_user_uid: null,
    role_uid: null,
  },
};

const userRolesSlice = createSlice({
  name: "userRoles",
  initialState,
  reducers: {
    updateUserHierarchyRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserHierarchySuccess: (state, action: PayloadAction<any>) => {
      state.userHierarchy = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserHierarchyFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    getUserHierarchyRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getUserHierarchySuccess: (state, action: PayloadAction<any>) => {
      state.userHierarchy = action.payload;
      state.loading = false;
      state.error = null;
    },
    getUserHierarchyFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserHierarchyRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserHierarchySuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    deleteUserHierarchyFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    addSupervisorRole: (state, action) => {
      state.supervisorRoles.push(action.payload);
    },
    setSupervisorRoles: (state, action: PayloadAction<SupervisorRole[]>) => {
      state.supervisorRoles = action.payload;
    },

    setRolePermissions: (state, action: PayloadAction<RolePermissions>) => {
      state.rolePermissions = action.payload;
    },

    getSupervisorRolesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSupervisorRolesSuccess: (
      state,
      action: PayloadAction<SupervisorRole[]>
    ) => {
      if (action.payload.length !== 0) {
        state.supervisorRoles = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    getSupervisorRolesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.supervisorRoles = [];
      state.error = action.payload;
    },

    getAllPermissionsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getAllPermissionsSuccess: (state, action: PayloadAction<any[]>) => {
      if (action.payload.length !== 0) {
        state.allPermissions = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    getAllPermissionsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.allPermissions = [];
      state.error = action.payload;
    },

    postSupervisorRolesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    postSupervisorRolesSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    postSupervisorRolesFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getSupervisorRolesRequest,
  getSupervisorRolesFailure,
  getSupervisorRolesSuccess,
  getAllPermissionsFailure,
  getAllPermissionsRequest,
  getAllPermissionsSuccess,
  postSupervisorRolesRequest,
  postSupervisorRolesSuccess,
  postSupervisorRolesFailure,
  addSupervisorRole,
  setSupervisorRoles,
  setRolePermissions,
  getUserHierarchyFailure,
  getUserHierarchyRequest,
  getUserHierarchySuccess,
  updateUserHierarchyFailure,
  updateUserHierarchyRequest,
  updateUserHierarchySuccess,
  deleteUserHierarchyFailure,
  deleteUserHierarchyRequest,
  deleteUserHierarchySuccess,
} = userRolesSlice.actions;

export default userRolesSlice.reducer;
