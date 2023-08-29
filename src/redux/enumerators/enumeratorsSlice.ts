import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EnumeratorsState {
  loading: boolean;
  error: any;
  csvColumnNames: string[];
  csvBase64Data: string;
  fileUploaded: boolean;
  csvRows: string[];
}

const initialState: EnumeratorsState = {
  loading: false,
  error: null,
  csvColumnNames: [],
  csvRows: [],
  csvBase64Data: "",
  fileUploaded: false,
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
    },
    postEnumeratorsMappingFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action;
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
  },
});

export const {
  setEnumeratorBase64Data,
  setEnumeratorCSVColumns,
  setEnumeratorFileUpload,
  setEnumeratorCSVRows,
  setLoading,
  postEnumeratorsMappingFailure,
  postEnumeratorsMappingRequest,
  postEnumeratorsMappingSuccess,
} = enumeratorsSlice.actions;

export default enumeratorsSlice.reducer;
