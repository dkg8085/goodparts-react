import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to remove multiple posts
export const selectShowSheetRemove = createAsyncThunk(
  'showsheet/removeMultiplePosts',
  async (payload, { rejectWithValue }) => {
    const storedApiKey = localStorage.getItem('api-key');
    const apiKey = storedApiKey ? JSON.parse(storedApiKey) : null;

    if (!apiKey) {
      return rejectWithValue('API key not found');
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/remove-multiple-posts`,
        payload,
        { headers: { 'api-key': apiKey } }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed');
    }
  }
);

// Thunk to remove saved show sheet posts
export const selectSavedShowSheetRemove = createAsyncThunk(
  'showsheet/removeSavedShowSheetPosts',
  async (payload, { rejectWithValue }) => {
    const storedApiKey = localStorage.getItem('api-key');
    const apiKey = storedApiKey ? JSON.parse(storedApiKey) : null;

    if (!apiKey) {
      return rejectWithValue('API key not found');
    }


    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/remove-saved-showsheet-posts`,
        payload,
        { headers: { 'api-key': apiKey } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed');
    }
  }
);
