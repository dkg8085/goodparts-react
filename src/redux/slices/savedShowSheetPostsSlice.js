import { createSlice } from '@reduxjs/toolkit';
import { saveShowSheetPost } from '../thunks/savedShowSheetPostsThunk';

const initialState = {
    savedShowSheetPosts: [],
    loading: false,
    error: null,
};

const saveShowSheetPostSlice = createSlice({
    name: 'savedShowSheetPosts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(saveShowSheetPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveShowSheetPost.fulfilled, (state, action) => {
                state.loading = false;
                state.savedShowSheetPosts = Array.isArray(action.payload)
                    ? action.payload
                    : [...state.savedShowSheetPosts, action.payload];
            })
            .addCase(saveShowSheetPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message || 'Something went wrong';
            });
    },
});

export default saveShowSheetPostSlice.reducer;
