import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/login`,
        credentials,
      );

      const {
        status,
        user,
        assign_taxonomies,
        taxonomy_settings,
        user_role,
        assign_terms,
      } = response.data;

      if (!status) {
        return rejectWithValue("Invalid credentials");
      }
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem(
        "assign_taxonomies",
        JSON.stringify(assign_taxonomies),
      );
      localStorage.setItem(
        "taxonomy_settings",
        JSON.stringify(taxonomy_settings),
      );
      localStorage.setItem("user_role", JSON.stringify(user_role));
      localStorage.setItem("assign_terms", JSON.stringify(assign_terms));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const refreshUserData = createAsyncThunk(
  "auth/refreshUserData",
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.ID) return rejectWithValue("No user found");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/refresh-user-data`,
        { user_id: user.ID },
      );

      if (!response.data.status) {
        return rejectWithValue("Refresh failed");
      }

      const { assign_taxonomies, taxonomy_settings, user_role, assign_terms } =
        response.data;

      localStorage.setItem(
        "assign_taxonomies",
        JSON.stringify(assign_taxonomies),
      );
      localStorage.setItem(
        "taxonomy_settings",
        JSON.stringify(taxonomy_settings),
      );
      localStorage.setItem("user_role", JSON.stringify(user_role));
      localStorage.setItem("assign_terms", JSON.stringify(assign_terms));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Refresh failed");
    }
  },
);
