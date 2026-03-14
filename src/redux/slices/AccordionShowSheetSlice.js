import { createSlice } from '@reduxjs/toolkit';
import { accordionShowSheet } from '../thunks/AccordionShowSheetThunk';

const initialState = {
    accordionShowSheetPosts: [],
    loading: false,
    error: null,
};

const accordionShowSheetSlice = createSlice({
    name: 'accordionShowSheet',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(accordionShowSheet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(accordionShowSheet.fulfilled, (state, action) => {
                state.loading = false;
                state.accordionShowSheetPosts = action.payload;
            })
            .addCase(accordionShowSheet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default accordionShowSheetSlice.reducer;
