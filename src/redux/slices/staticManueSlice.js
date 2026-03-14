import { createSlice } from '@reduxjs/toolkit';
import { staticMenu } from '../thunks/staticManueThunk';

const initialState = {
  menusStatic: [],
  loading: false,
  error: null,
};


const staticMenuSlice = createSlice({
  name: 'staticMenus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(staticMenu.pending, (state) => {
        state.loading = true;
        state.error = null; 
      })
      .addCase(staticMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menusStatic = action.payload;
        state.error = null; 
      })
      .addCase(staticMenu.rejected, (state, action) => {
        state.loading = false;
        state.menusStatic = []; 
        state.error = action.payload || action.error?.message || 'Failed to fetch menus';
      });
  },
});

export default staticMenuSlice.reducer;
