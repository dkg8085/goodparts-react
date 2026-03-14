import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const staticMenu = createAsyncThunk(
  'staticMenu/fetch',
  async (_, { rejectWithValue }) => { 
    try {
      const storedApiKey = localStorage.getItem('api-key');
      const apiKey = storedApiKey ? JSON.parse(storedApiKey) : null;
      if (!apiKey) {
        return rejectWithValue("API key not found in session storage");
      }
       const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}api/static-menu`,
        {
          headers: {
            'api-Key': apiKey,
          },
        }
      );
       return response.data.data;
    } 
    catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch menus'
      );
    }
  }
);