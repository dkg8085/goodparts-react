import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const resetPassword = createAsyncThunk(
  'Reset/password',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/forgot-password`,
        credentials
      );  
    } catch (error) {
      // Handle 404 specifically (if the email is not found)
      if (error.response?.status === 404) {
        return rejectWithValue('Email not found. ');
      }
      
      return rejectWithValue(error.response?.data?.message || 'Password reset failed. Please try again.');
    }
  }
);
