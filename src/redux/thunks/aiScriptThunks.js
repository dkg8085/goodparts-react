import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAiScript = createAsyncThunk(
  "aiScript/fetch",
  async ({ search }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/ai-script-search`,
        { search }
      );

      if (response.data.status !== "success") {
        return rejectWithValue(response.data.error);
      }

      return response.data.answer;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "AI search failed"
      );
    }
  }
);

export const saveAiScript = createAsyncThunk(
  "aiScript/save",
  async ({ title, content, user_id }, { rejectWithValue }) => {
    try {
      const apiKey = JSON.parse(localStorage.getItem("api-key"));

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/save-ai-script`,
        { title, content, user_id },
        {
          headers: {
            "api-key": apiKey,
          },
        }
      );

      if (!response.data.status) {
        return rejectWithValue(response.data.message);
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Save failed"
      );
    }
  }
);

export const saveAndAddAiScript = createAsyncThunk(
  "aiScript/saveAndAdd",
  async ({ que, ans, usr }, { rejectWithValue }) => {
    try {
      const apiKey = JSON.parse(localStorage.getItem("api-key"));

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/save-and-add`,
        { que, ans, usr },
        {
          headers: {
            "api-key": apiKey,
          },
        }
      );

      if (!response.data.status) {
        return rejectWithValue(response.data.message);
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Save & add failed"
      );
    }
  }
);

export const addToShowSheet = createAsyncThunk(
  "aiScript/addToShowSheet",
  async ({ que, ans }, { rejectWithValue }) => {
    try {
      const apiKey = JSON.parse(localStorage.getItem("api-key"));

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/add-to-show-sheet`,
        { que, ans },
        {
          headers: {
            "api-key": apiKey,
          },
        }
      );

      if (!response.data.status) {
        return rejectWithValue(response.data.message);
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Add to show sheet failed"
      );
    }
  }
);
