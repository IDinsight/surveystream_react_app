import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getTarget,
  getTargetSCTOColumns,
  postTargetConfig,
  updateTargetSCTOColumns,
} from "./apiService";
import { act } from "react-dom/test-utils";

interface TargetsState {
  loading: boolean;
  error: any;
  csvColumnNames: string[];
  csvBase64Data: string;
  fileUploaded: boolean;
  csvRows: string[];
  targetsList: string[];
  targetsColumnConfig: any;
  targetsColumnMapping: any;
  mappingErrorStatus: boolean;
  mappingErrorList: any;
  mappingErrorCount: number;
  targetDetails: any;
  targetConfig: any;
  uploadMode: string;
}

const initialState: TargetsState = {
  loading: false,
  error: null,
  csvColumnNames: [],
  csvRows: [],
  csvBase64Data: "",
  fileUploaded: false,
  targetsList: [],
  targetDetails: {},
  targetsColumnConfig: null,
  targetsColumnMapping: null,
  mappingErrorStatus: false,
  mappingErrorList: null,
  mappingErrorCount: 0,
  targetConfig: [],
  uploadMode: "merge",
};

const targetsSlice = createSlice({
  name: "targets",
  initialState,
  reducers: {
    postTargetsMappingRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    postTargetsMappingSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.csvBase64Data = "";
      state.fileUploaded = false;
    },
    postTargetsMappingFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setTargetsBase64Data: (state, action: PayloadAction<any>) => {
      state.csvBase64Data = action.payload;
    },
    setTargetsCSVColumns: (state, action: PayloadAction<any>) => {
      state.csvColumnNames = action.payload;
    },
    setTargetsCSVRows: (state, action: PayloadAction<any>) => {
      state.csvRows = action.payload;
    },
    setTargetsFileUpload: (state, action: PayloadAction<any>) => {
      state.fileUploaded = action.payload;
    },
    setLoading: (state, action: PayloadAction<any>) => {
      state.loading = action.payload;
    },
    setTargetsColumnMapping: (state, action: PayloadAction<any>) => {
      state.targetsColumnMapping = action.payload;
    },
    setMappingErrorStatus: (state, action: PayloadAction<any>) => {
      state.mappingErrorStatus = action.payload;
    },
    setMappingErrorList: (state, action: PayloadAction<any>) => {
      state.mappingErrorList = action.payload;
    },
    setMappingErrorCount: (state, action: PayloadAction<any>) => {
      state.mappingErrorCount = action.payload;
    },
    setuploadMode: (state, action: PayloadAction<any>) => {
      state.uploadMode = action.payload;
    },
    getTargetsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    getTargetsSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.targetsList = action.payload.data;
    },
    getTargetsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.targetsList = [];
    },
    getTargetDetailsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    getTargetDetailsSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.targetDetails = action.payload.data;
    },
    getTargetDetailsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.targetDetails = {};
    },

    updateTargetsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateTargetsSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    updateTargetsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    bulkUpdateTargetsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    bulkUpdateTargetsSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    bulkUpdateTargetsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    getTargetsColumnConfigRequest: (state) => {
      state.loading = false; //keep this false to avoid modal from reloading
      state.error = null;
    },
    getTargetsColumnConfigSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.targetsColumnConfig = action.payload;
    },
    getTargetsColumnConfigFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateTargetColumnConfigRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateTargetColumnConfigSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    updateTargetColumnConfigFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    getTargetsConfigRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getTargetsConfigSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.targetConfig = action.payload;
    },
    getTargetsConfigFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    postTargetConfigRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    postTargetConfigSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    postTargetConfigFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    putTargetConfigRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    putTargetConfigSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.csvColumnNames = action.payload.data;
    },
    putTargetConfigFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    getTargetSCTOColumnsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getTargetSCTOColumnsSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    getTargetSCTOColumnsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateTargetSCTOColumnsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateTargetSCTOColumnsSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    updateTargetSCTOColumnsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setTargetsBase64Data,
  setTargetsCSVColumns,
  setTargetsFileUpload,
  setTargetsCSVRows,
  setLoading,
  setTargetsColumnMapping,
  setMappingErrorList,
  setMappingErrorCount,
  setMappingErrorStatus,
  postTargetsMappingFailure,
  postTargetsMappingRequest,
  postTargetsMappingSuccess,
  getTargetsRequest,
  getTargetsColumnConfigFailure,
  getTargetsColumnConfigRequest,
  getTargetsColumnConfigSuccess,
  getTargetsFailure,
  getTargetsSuccess,
  updateTargetColumnConfigFailure,
  updateTargetColumnConfigRequest,
  updateTargetColumnConfigSuccess,
  updateTargetsFailure,
  updateTargetsRequest,
  updateTargetsSuccess,
  bulkUpdateTargetsFailure,
  bulkUpdateTargetsRequest,
  bulkUpdateTargetsSuccess,
  getTargetDetailsRequest,
  getTargetDetailsSuccess,
  getTargetDetailsFailure,
  getTargetsConfigRequest,
  getTargetsConfigSuccess,
  getTargetsConfigFailure,
  postTargetConfigRequest,
  postTargetConfigSuccess,
  postTargetConfigFailure,
  putTargetConfigRequest,
  putTargetConfigSuccess,
  putTargetConfigFailure,
  getTargetSCTOColumnsRequest,
  getTargetSCTOColumnsSuccess,
  getTargetSCTOColumnsFailure,
  updateTargetSCTOColumnsRequest,
  updateTargetSCTOColumnsSuccess,
  updateTargetSCTOColumnsFailure,
  setuploadMode,
} = targetsSlice.actions;

export default targetsSlice.reducer;
