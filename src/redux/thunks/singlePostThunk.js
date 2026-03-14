import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSinglePost = createAsyncThunk(
  "singlePost/fetch",
  async ({ slug, category }, { rejectWithValue }) => {
    try {
      const storedApiKey = localStorage.getItem('api-key');
      const apiKey = storedApiKey ? JSON.parse(storedApiKey) : null;
      const userString = localStorage.getItem("user");
      let user_id = '';

      if (userString) {
        const user = JSON.parse(userString); // Convert JSON string to object
        user_id = user.ID;
      }

      if (!apiKey) {
        return rejectWithValue("API key not found in session storage");
      }

      const response = await axios.get(
        // `${import.meta.env.VITE_API_BASE_URL}api/single_post/?slug=${slug}&category=${encodeURIComponent(category)}&user_id=${user_id}`,
        `${import.meta.env.VITE_API_BASE_URL}api/single_post/?slug=${slug}${category ? `&category=${encodeURIComponent(category)}` : ''}&user_id=${user_id}`,
        {
          headers: {
            'api-Key': apiKey
          },
        }
      );
      return response.data.data;
      console.log(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch post");
    }
  }
);
