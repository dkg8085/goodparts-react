import { createSlice } from "@reduxjs/toolkit";
import { fetchPrepSection } from "../thunks/prepSectionThunks";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const prepSectionSlice = createSlice({
  name: "prepSection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrepSection.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPrepSection.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPrepSection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default prepSectionSlice.reducer;
