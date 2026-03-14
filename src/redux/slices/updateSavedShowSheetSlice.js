import { createSlice } from '@reduxjs/toolkit';
import { updateSavedShowSheet } from '../thunks/updateSavedShowSheetThunk';

const initialState = {
    updateSavedShowSheetMessage: [], 
    loading: false,
    error: null,
};

const updateSavedShowSheetSlice = createSlice({
    name: 'savedshowSheet',
    initialState,
    reducers: {
        resetUpdateSavedShowSheetMessage: (state) => {
            state.updateSavedShowSheetMessage = []; 
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateSavedShowSheet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSavedShowSheet.fulfilled, (state, action) => {
                state.loading = false;
                state.updateSavedShowSheetMessage = action.payload;
            })
            .addCase(updateSavedShowSheet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error ? action.error.message : 'An error occurred';
            });
    },
});


export const { resetUpdateSavedShowSheetMessage } = updateSavedShowSheetSlice.actions;
export default updateSavedShowSheetSlice.reducer;
