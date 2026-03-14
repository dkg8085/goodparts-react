import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
export const menusItems = createAsyncThunk(
  'menus/fetch',
  async (userID, { rejectWithValue }) => {
    try {
      const storedApiKey = localStorage.getItem('api-key');
      const apiKey = storedApiKey ? JSON.parse(storedApiKey) : null;
      if (!apiKey) {
        return rejectWithValue("API key not found in session storage");
      }
      if (!userID || typeof userID !== "string") {
        return rejectWithValue("Invalid or missing user ID");
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}wp/v2/menu/main-menu/?user=${userID}`,
        {
          headers: {
            'api-key': apiKey,
          },
        }
      );
      // console.log(response.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch menus'
      );
    }
  }
);