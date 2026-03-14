import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment";

export const fetchTaxonomyPosts = createAsyncThunk(
  "filtertaxonomyPosts/fetch",
  async (date, { rejectWithValue }) => {
    try {
      const storedApiKey = localStorage.getItem("api-key");
      const apiKey = storedApiKey ? JSON.parse(storedApiKey) : null;
      const selectedTaxonomy = localStorage.getItem("selectedTaxonomy");
      let assignTaxonomyName = "";
      if (selectedTaxonomy) {
        assignTaxonomyName = selectedTaxonomy;
      } else {
        const assignTaxonomy = localStorage.getItem("assign_taxonomies");
        const assignTaxonomyData = assignTaxonomy
          ? JSON.parse(assignTaxonomy)
          : null;
        assignTaxonomyName = assignTaxonomyData ? assignTaxonomyData[0] : null;
      }
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      if (!user?.ID) {
        return rejectWithValue("User ID not found in session storage");
      }

      const formattedDate = moment(date).format("YYYY-MM-DD");
      if (!apiKey) {
        return rejectWithValue("API key not found in session storage");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}api/taxonomy_posts/?taxonomy_slug=${assignTaxonomyName}&date=${formattedDate}&user_id=${user?.ID}`,
        {
          headers: {
            "api-Key": apiKey,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts",
      );
    }
  },
);

// NEW thunk for Tabloid-only (no date)
export const fetchTermPosts = createAsyncThunk(
  "filtertaxonomyPosts/fetchByTerm",
  async ({ termId, signal } = {}, { rejectWithValue }) => {
    try {
      const storedApiKey = localStorage.getItem("api-key");
      const apiKey = storedApiKey ? JSON.parse(storedApiKey) : null;
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      if (!user?.ID) return rejectWithValue("User ID not found");
      if (!apiKey) return rejectWithValue("API key not found");
      if (!termId) return rejectWithValue("Term ID not provided");

      const params = new URLSearchParams({
        term_id: termId,
        user_id: user.ID,
      });

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}api/term_posts/?${params.toString()}`,
        {
          headers: { "api-Key": apiKey },
          signal,
          timeout: 60000, // optional, increase if needed
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return rejectWithValue("Request cancelled");
      if (error.code === "ECONNABORTED")
        return rejectWithValue("Request timeout");
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch",
      );
    }
  },
);
