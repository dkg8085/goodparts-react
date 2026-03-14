import { createSlice } from '@reduxjs/toolkit';
import { deleteNewSection } from '../thunks/DeleteNewSectionThunk';

const initialState = {
    data: [],
    loading: false,
    error: null,
};

const deleteNewSectionSlice = createSlice({
    name: 'deleteNewSection',
    initialState,
    reducers: {
        clearData: (state) => {
            state.data = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteNewSection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteNewSection.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(deleteNewSection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error ? action.error.message : 'Something went wrong';
            });
    },
});

export const { clearData } = deleteNewSectionSlice.actions;
export default deleteNewSectionSlice.reducer;
