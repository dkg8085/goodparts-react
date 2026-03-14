import { createSlice } from '@reduxjs/toolkit';
import { updateShowSheet } from '../thunks/UpdateShowSheetThunk';

const initialState = {
    updateShowSheetMessage : [],
    loading: false,
    error: null,
};

const updateShowSheetSlice = createSlice({
    name: 'showSheetPosts',
    initialState,
    reducers: {
        resetUpdateShowSheetMessage: (state) => {
            state.updateShowSheetMessage = []; 
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateShowSheet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateShowSheet.fulfilled, (state, action) => {
                state.loading = false;
                state.updateShowSheetMessage = action.payload;
            })
            .addCase(updateShowSheet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export the action
export const { resetUpdateShowSheetMessage } = updateShowSheetSlice.actions;
export default updateShowSheetSlice.reducer;
