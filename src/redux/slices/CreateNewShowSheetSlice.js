import { createSlice } from '@reduxjs/toolkit';
import { CreateShowSheet } from '../thunks/CreateNewShowSheetThunk';

const initialState = {
    createShowSheet: [],
    message: '',
    loading: false,
    error: null,
};

const accordionShowSheetSlice = createSlice({
    name: 'createShowSheet',
    initialState,
    reducers: {
        clearMessage: (state) => {
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(CreateShowSheet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(CreateShowSheet.fulfilled, (state, action) => {
                state.loading = false;
                state.createShowSheet = action.payload;
                state.message = action.payload.message
            })
            .addCase(CreateShowSheet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearMessage } = accordionShowSheetSlice.actions;
export default accordionShowSheetSlice.reducer;