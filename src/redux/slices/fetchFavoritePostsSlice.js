import { createSlice } from '@reduxjs/toolkit';
import { fetchFavoritePostList } from '../thunks/fetchFavoritePostsThunk';


const fetchFavoritePostListSlice = createSlice({
    name: "favoritePostList",
    initialState: {
        data: [],
        loading: false,
        success: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavoritePostList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavoritePostList.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchFavoritePostList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default fetchFavoritePostListSlice.reducer;