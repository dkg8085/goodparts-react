import { createSlice } from '@reduxjs/toolkit';
import { toggleFavorite } from '../thunks/favoritesThunk';


const favoritesSlice = createSlice({
    name: "favorites",
    initialState: {
        favoritePosts: "",
        loading: false,
        success: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(toggleFavorite.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleFavorite.fulfilled, (state, action) => {
                state.loading = false;
                state.favoritePosts = action.payload;
            })
            .addCase(toggleFavorite.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default favoritesSlice.reducer;