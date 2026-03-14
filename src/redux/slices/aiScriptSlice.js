import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAiScript,
  saveAiScript,
  saveAndAddAiScript,
  addToShowSheet,
} from "../thunks/aiScriptThunks";

const initialState = {
  answer: null,
  showSheet: [],
  status: "idle",
  error: null,
};

const aiScriptSlice = createSlice({
  name: "aiScript",
  initialState,
  reducers: {
    clearAiAnswer: (state) => {
      state.answer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // AI Search
      .addCase(fetchAiScript.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAiScript.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.answer = action.payload;
      })
      .addCase(fetchAiScript.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add to show sheet
      .addCase(addToShowSheet.fulfilled, (state, action) => {
        state.showSheet = action.payload.ai_scripts;
      });
  },
});

export const { clearAiAnswer } = aiScriptSlice.actions;
export default aiScriptSlice.reducer;
