import { createSlice } from '@reduxjs/toolkit';
import { resetPassword } from '../thunks/ResetPasswordThunk';

const initialState = {
  passwordResetResponse: null,  
  loading: false,
  error: null,
};

const resetpasswordSlice = createSlice({
  name: 'ResetPassword',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordResetResponse = action.payload; 
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default resetpasswordSlice.reducer;
