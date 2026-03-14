import { createSlice } from '@reduxjs/toolkit';
import { dropDownShowSheet } from '../thunks/AddActionShowSheetThunk';

const initialState = {
    data: [],
    loading: false,
    error: null,
};

const addActionShowSheetSlice = createSlice({
    name: 'addActionShowSheet',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(dropDownShowSheet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(dropDownShowSheet.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(dropDownShowSheet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default addActionShowSheetSlice.reducer;
