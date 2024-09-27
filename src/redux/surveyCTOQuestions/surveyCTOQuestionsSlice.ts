import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SurveyCTOQuestionsForm } from "./types";

interface SurveyCTOQuestionsState {
  loading: boolean;
  error: any;
  surveyCTOQuestions: any;
  surveyCTOQuestionsForm: SurveyCTOQuestionsForm;
}

const initialState: SurveyCTOQuestionsState = {
  loading: false,
  error: null,
  surveyCTOQuestionsForm: {
    enumerator_id: "",
    form_uid: "",
    locations: {},
    revisit_section: "",
    survey_status: "",
    target_id: "",
  },
  surveyCTOQuestions: [],
};

const surveyCTOQuestionsSlice = createSlice({
  name: "surveyCTOQuestions",
  initialState,
  reducers: {
    setSurveyCTOQuestionsForm: (state, action: PayloadAction<any>) => {
      state.surveyCTOQuestionsForm = action.payload;
    },
    resetSurveyCTOQuestionsForm: (state) => {
      state.surveyCTOQuestionsForm = initialState.surveyCTOQuestionsForm;
    },
    getFormQuestionsDefinitionRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getFormQuestionsDefinitionFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    getFormQuestionsDefinitionSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.surveyCTOQuestions = action.payload;
    },
    getFormMappingRequest: (state) => {
      state.loading = false;
      state.error = null;
    },
    getFormMappingSuccess: (
      state,
      action: PayloadAction<SurveyCTOQuestionsForm>
    ) => {
      state.loading = false;
      state.error = null;
      state.surveyCTOQuestionsForm = action.payload;
    },
    getFormMappingFailure: (state, action: PayloadAction<any>) => {
      state.surveyCTOQuestionsForm.new_form = true;
      state.loading = false;
      state.error = action.payload;
    },

    postFormMappingRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    postFormMappingSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    postFormMappingFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    putFormMappingRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    putFormMappingSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    putFormMappingFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getFormMappingSuccess,
  getFormMappingFailure,
  getFormMappingRequest,
  getFormQuestionsDefinitionFailure,
  getFormQuestionsDefinitionRequest,
  getFormQuestionsDefinitionSuccess,
  postFormMappingFailure,
  postFormMappingRequest,
  postFormMappingSuccess,
  putFormMappingFailure,
  putFormMappingRequest,
  putFormMappingSuccess,
  setSurveyCTOQuestionsForm,
  resetSurveyCTOQuestionsForm,
} = surveyCTOQuestionsSlice.actions;

export default surveyCTOQuestionsSlice.reducer;
