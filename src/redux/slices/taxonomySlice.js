import { createSlice } from "@reduxjs/toolkit";
import { fetchTaxonomyPosts, fetchTermPosts } from "../thunks/taxonomyThunks";

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

const taxonomySlice = createSlice({
  name: "taxonomyPosts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Existing thunk
      .addCase(fetchTaxonomyPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxonomyPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchTaxonomyPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // NEW thunk
      .addCase(fetchTermPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTermPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchTermPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default taxonomySlice.reducer;
