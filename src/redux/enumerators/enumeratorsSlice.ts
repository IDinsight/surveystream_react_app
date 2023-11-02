import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EnumeratorsState {
  loading: boolean;
  error: any;
  csvColumnNames: string[];
  csvBase64Data: string;
  fileUploaded: boolean;
  csvRows: string[];
  enumeratorList: string[];
  enumeratorColumnConfig: any;
  enumeratorColumnMapping: any;
}

const initialState: EnumeratorsState = {
  loading: false,
  error: null,
  csvColumnNames: [],
  csvRows: [],
  csvBase64Data: "",
  fileUploaded: false,
  enumeratorList: [],
  enumeratorColumnConfig: null,
  enumeratorColumnMapping: null,
};

const enumeratorsSlice = createSlice({
  name: "enumerators",
  initialState,
  reducers: {
    postEnumeratorsMappingRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    postEnumeratorsMappingSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.csvBase64Data = "";
      state.fileUploaded = false;
    },
    postEnumeratorsMappingFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setEnumeratorBase64Data: (state, action: PayloadAction<any>) => {
      state.csvBase64Data = action.payload;
    },
    setEnumeratorCSVColumns: (state, action: PayloadAction<any>) => {
      state.csvColumnNames = action.payload;
    },
    setEnumeratorCSVRows: (state, action: PayloadAction<any>) => {
      state.csvRows = action.payload;
    },
    setEnumeratorFileUpload: (state, action: PayloadAction<any>) => {
      state.fileUploaded = action.payload;
    },
    setLoading: (state, action: PayloadAction<any>) => {
      state.loading = action.payload;
    },
    setEnumeratorColumnMapping: (state, action: PayloadAction<any>) => {
      state.enumeratorColumnMapping = action.payload;
    },

    getEnumeratorsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    getEnumeratorsSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.enumeratorList = action.payload.data;
    },
    getEnumeratorsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.enumeratorList = [];
    },

    updateEnumeratorRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateEnumeratorSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    updateEnumeratorFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    bulkUpdateEnumeratorsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    bulkUpdateEnumeratorsSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    bulkUpdateEnumeratorsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    bulkUpdateEnumeratorsLocationMappingRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    bulkUpdateEnumeratorsLocationMappingSuccess: (
      state,
      action: PayloadAction<any>
    ) => {
      state.loading = false;
      state.error = null;
    },
    bulkUpdateEnumeratorsLocationMappingFailure: (
      state,
      action: PayloadAction<any>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },

    getEnumeratorsColumnConfigRequest: (state) => {
      state.loading = false; //keep this false to avoid modal from reloading
      state.error = null;
    },
    getEnumeratorsColumnConfigSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.enumeratorColumnConfig = action.payload;
    },
    getEnumeratorsColumnConfigFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateEnumeratorColumnConfigRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateEnumeratorColumnConfigSuccess: (
      state,
      action: PayloadAction<any>
    ) => {
      state.loading = false;
      state.error = null;
    },
    updateEnumeratorColumnConfigFailure: (
      state,
      action: PayloadAction<any>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setEnumeratorBase64Data,
  setEnumeratorCSVColumns,
  setEnumeratorFileUpload,
  setEnumeratorCSVRows,
  setLoading,
  setEnumeratorColumnMapping,
  postEnumeratorsMappingFailure,
  postEnumeratorsMappingRequest,
  postEnumeratorsMappingSuccess,
  getEnumeratorsRequest,
  getEnumeratorsFailure,
  getEnumeratorsSuccess,
  updateEnumeratorFailure,
  updateEnumeratorRequest,
  updateEnumeratorSuccess,
  bulkUpdateEnumeratorsFailure,
  bulkUpdateEnumeratorsRequest,
  bulkUpdateEnumeratorsSuccess,
  bulkUpdateEnumeratorsLocationMappingFailure,
  bulkUpdateEnumeratorsLocationMappingRequest,
  bulkUpdateEnumeratorsLocationMappingSuccess,
  getEnumeratorsColumnConfigFailure,
  getEnumeratorsColumnConfigRequest,
  getEnumeratorsColumnConfigSuccess,
  updateEnumeratorColumnConfigFailure,
  updateEnumeratorColumnConfigRequest,
  updateEnumeratorColumnConfigSuccess,
} = enumeratorsSlice.actions;

export default enumeratorsSlice.reducer;
