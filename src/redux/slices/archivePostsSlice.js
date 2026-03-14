import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: null,
  terms: [],
  loading: false,
  error: null,
  pagination: {
    current_page: 1,
    per_page: 20,
    total_posts: 0,
    total_pages: 1,
  },
};

const archivePostsSlice = createSlice({
  name: 'archivePosts',
  initialState,
  reducers: {
    fetchArchivePostsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchArchivePostsSuccess: (state, action) => {
      state.loading = false;
      state.posts = action.payload.posts;
      state.terms = action.payload.terms;
      state.pagination = action.payload.pagination || {
        current_page: 1,
        per_page: 20,
        total_posts: action.payload.posts?.length || 0,
        total_pages: 1,
      };
    },
    fetchArchivePostsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchArchivePostsRequest,
  fetchArchivePostsSuccess,
  fetchArchivePostsFailure,
} = archivePostsSlice.actions;

export default archivePostsSlice.reducer;