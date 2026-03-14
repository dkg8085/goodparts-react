import { createSlice } from '@reduxjs/toolkit';
import { CreateNewActionShowSheet } from '../thunks/CreateNewActionShowSheetThunk';

const initialState = {
    CreateNewAction: [],
    loading: false,
    error: null,
};

const createNewActionShowSheetSlice = createSlice({
    name: 'CreateNewActionShowSheet',
    initialState,
    reducers: {
        clearCreateNewAction: (state) => {
            state.CreateNewAction = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(CreateNewActionShowSheet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(CreateNewActionShowSheet.fulfilled, (state, action) => {
                state.loading = false;
                state.CreateNewAction = action.payload;
            })
            .addCase(CreateNewActionShowSheet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCreateNewAction } = createNewActionShowSheetSlice.actions;
export default createNewActionShowSheetSlice.reducer;
