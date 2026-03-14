import { createSlice } from "@reduxjs/toolkit";
import { submitContactForm } from "../thunks/contactUsThunk";

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    formData: {}, 
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    setFormData: (state, action) => {
      const { fieldId, value } = action.payload;
      state.formData[fieldId] = value;
    },
    resetForm: (state) => {
      state.formData = {};
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFormData, resetForm } = contactSlice.actions;
export default contactSlice.reducer;
