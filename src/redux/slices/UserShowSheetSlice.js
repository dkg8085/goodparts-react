import { createSlice } from '@reduxjs/toolkit';
import { userShowSheet } from '../thunks/UserShowSheetThunk';

const initialState = {
  showSheetPosts: [],
  loading: false,
  error: null,
};

const showSheetSlice = createSlice({
  name: 'showSheetPosts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userShowSheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userShowSheet.fulfilled, (state, action) => {
        state.loading = false;
        state.showSheetPosts = action.payload;
      })
      .addCase(userShowSheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default showSheetSlice.reducer;
