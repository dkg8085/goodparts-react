import { createSlice } from '@reduxjs/toolkit';
import { fetchSearchPost } from '../thunks/searchPostThunk';

const initialState = {
  searchPost: null,
  pagination: null,
  loading: false,
  error: null,
};

const searchPostSlice = createSlice({
  name: 'searchPost',
  initialState,
  reducers: {
    clearSearchPost: (state) => {
      state.searchPost = null;
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchPost.fulfilled, (state, action) => {
        state.loading = false;
        state.searchPost = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSearchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearchPost } = searchPostSlice.actions;
export default searchPostSlice.reducer;