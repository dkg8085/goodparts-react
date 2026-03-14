import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const contactUsInfo = createAsyncThunk(
  "contactInfo/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const storedApiKey = localStorage.getItem("api-key");
      let apiKey = storedApiKey ? JSON.parse(storedApiKey) : null;

      if (!apiKey) {
        return rejectWithValue("API key not found in session storage");
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');

      const response = await axios.get(`${baseUrl}/api/contact-form-fields`, {
        headers: {
          "api-Key": apiKey,
        },
      });
      return response.data?.data ?? []; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch contact form fields"
      );
    }
  }
);
