import { createSlice } from '@reduxjs/toolkit';
import { updateShowSheetBreak } from '../thunks/UpdateShowSheetBreakThunk';

const initialState = {
    data: [],
    loading: false,
    error: null,
};

const updateShowSheetBreakSlice = createSlice({
    name: 'updateShowSheetBreak',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateShowSheetBreak.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateShowSheetBreak.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(updateShowSheetBreak.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default updateShowSheetBreakSlice.reducer;
