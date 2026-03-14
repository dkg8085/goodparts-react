import { createSlice } from '@reduxjs/toolkit';
import { fetchSearchTaxonomyTerms } from '../thunks/searchTaxonomyTermsThunk';

const initialState = {
    terms: [],
    loading: false,
    error: null,
};

const seatchTaxonomyTermsSlice = createSlice({
    name: 'searchTaxonomyTerms',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchTaxonomyTerms.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSearchTaxonomyTerms.fulfilled, (state, action) => {
                state.loading = false;
                state.terms = action.payload;
            })
            .addCase(fetchSearchTaxonomyTerms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default seatchTaxonomyTermsSlice.reducer;
