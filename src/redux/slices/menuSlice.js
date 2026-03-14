import { createSlice } from '@reduxjs/toolkit';
import { menusItems } from '../thunks/menuThunk';

const initialState = {
  menus: [],
  loading: false,
  error: null,
};


const menuSlice = createSlice({
  name: 'menus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(menusItems.pending, (state) => {
        state.loading = true;
        state.error = null; 
      })
      .addCase(menusItems.fulfilled, (state, action) => {
        state.loading = false;
        state.menus = action.payload;
        state.error = null; 
      })
      .addCase(menusItems.rejected, (state, action) => {
        state.loading = false;
        state.menus = []; 
        state.error = action.payload || action.error?.message || 'Failed to fetch menus';
      });
  },
});

export default menuSlice.reducer;
