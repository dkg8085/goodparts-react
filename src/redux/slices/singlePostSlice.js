import { createSlice } from '@reduxjs/toolkit';
import { fetchSinglePost } from '../thunks/singlePostThunk';

const initialState = {
  post: null,
  loading: false,
  error: null,
};

const singlePostSlice = createSlice({
  name: 'singlePost',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSinglePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSinglePost.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload;
      })
      .addCase(fetchSinglePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default singlePostSlice.reducer;
