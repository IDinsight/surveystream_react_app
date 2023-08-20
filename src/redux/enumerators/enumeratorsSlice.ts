import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EnumeratorsState {
  loading: boolean;
  error: any;
  csvColumnNames: string[];
  csvBase64Data: string;
  fileUploaded: boolean;
}

const initialState: EnumeratorsState = {
  loading: false,
  error: null,
  csvColumnNames: [],
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
    setEnumeratorFileUpload: (state, action: PayloadAction<any>) => {
      state.fileUploaded = action.payload;
    },
  },
});

export const {
  setEnumeratorBase64Data,
  setEnumeratorCSVColumns,
  setEnumeratorFileUpload,
  postEnumeratorsMappingFailure,
  postEnumeratorsMappingRequest,
  postEnumeratorsMappingSuccess,
} = enumeratorsSlice.actions;

export default enumeratorsSlice.reducer;
