import { createSlice } from '@reduxjs/toolkit';
import { fetchTaxonomyTerms } from '../thunks/taxonomyTermsThunk';

const initialState = {
  terms: [],
  loading: false,
  error: null,
};


const taxonomyTermsSlice = createSlice({
  name: 'taxonomyTerms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxonomyTerms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTaxonomyTerms.fulfilled, (state, action) => {
        state.loading = false;
        state.terms = action.payload;
      })
      .addCase(fetchTaxonomyTerms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default taxonomyTermsSlice.reducer;
