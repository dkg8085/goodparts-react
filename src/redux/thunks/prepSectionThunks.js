import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPrepSection = createAsyncThunk(
  "prepSection/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}api/v1/prep-section`
      );

      if (response.data.status !== "ok") {
        return rejectWithValue("Failed to fetch prep section");
      }
      return response.data.items;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Prep section fetch failed"
      );
    }
  }
);
