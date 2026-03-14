import { createSlice } from "@reduxjs/toolkit";
import { contactUsInfo } from "../thunks/contactUsFetchInfoThunk";

const contactUsInfoSlice = createSlice({
  name: "contactUsInfo",
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(contactUsInfo.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(contactUsInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(contactUsInfo.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = [];
      });
  },
});

export default contactUsInfoSlice.reducer;
