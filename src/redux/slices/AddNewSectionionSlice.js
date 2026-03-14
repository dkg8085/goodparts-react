import { createSlice } from '@reduxjs/toolkit';
import { addNewActionOnshowSheet } from '../thunks/AddNewSectionionThunk';

const initialState = {
    data: [],
    loading: false,
    error: null,
};

const addNewActionSlice = createSlice({
    name: 'addNewaction',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addNewActionOnshowSheet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNewActionOnshowSheet.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(addNewActionOnshowSheet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default addNewActionSlice.reducer;
