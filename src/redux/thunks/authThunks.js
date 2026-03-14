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
  async (userId, { rejectWithValue }) => {
    try {
      let targetUserId;
      if (userId) {
        // Restore: use the provided user ID
        targetUserId = userId;
      } else {
        // Normal refresh: get current user from localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.ID) return rejectWithValue("No user found");
        targetUserId = user.ID;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/refresh-user-data`,
        { user_id: targetUserId },
      );

      if (!response.data.status) {
        return rejectWithValue(response.data.message || "Refresh failed");
      }

      const {
        assign_taxonomies,
        taxonomy_settings,
        user_role,
        assign_terms,
        user,
      } = response.data;

      if (assign_taxonomies) {
        localStorage.setItem(
          "assign_taxonomies",
          JSON.stringify(assign_taxonomies),
        );
      }
      if (taxonomy_settings) {
        localStorage.setItem(
          "taxonomy_settings",
          JSON.stringify(taxonomy_settings),
        );
      }
      if (user_role) {
        localStorage.setItem("user_role", JSON.stringify(user_role));
      }
      if (assign_terms) {
        localStorage.setItem("assign_terms", JSON.stringify(assign_terms));
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Refresh failed");
    }
  },
);

// export const refreshUserData = createAsyncThunk(
//   "auth/refreshUserData",
//   async (_, { rejectWithValue }) => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       if (!user?.ID) return rejectWithValue("No user found");

//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}api/refresh-user-data`,
//         { user_id: user.ID },
//       );

//       if (!response.data.status) {
//         return rejectWithValue("Refresh failed");
//       }

//       const { assign_taxonomies, taxonomy_settings, user_role, assign_terms } =
//         response.data;

//       localStorage.setItem(
//         "assign_taxonomies",
//         JSON.stringify(assign_taxonomies),
//       );
//       localStorage.setItem(
//         "taxonomy_settings",
//         JSON.stringify(taxonomy_settings),
//       );
//       localStorage.setItem("user_role", JSON.stringify(user_role));
//       localStorage.setItem("assign_terms", JSON.stringify(assign_terms));

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Refresh failed");
//     }
//   },
// );

export const emulateLogin = createAsyncThunk(
  "auth/emulateLogin",
  async (token, { rejectWithValue }) => {
    try {
      const currentUser = localStorage.getItem("user");
      if (currentUser) {
        localStorage.setItem("previousUser", currentUser);
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/emulate-login`,
        { token },
      );

      if (!response.data.status) {
        return rejectWithValue(response.data.message || "Emulation failed");
      }

      const {
        user,
        "api-key": apiKey,
        user_role,
        assign_taxonomies,
        assign_terms,
        taxonomy_settings,
      } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("api-key", JSON.stringify(apiKey));
      localStorage.setItem("user_role", JSON.stringify(user_role));
      localStorage.setItem(
        "assign_taxonomies",
        JSON.stringify(assign_taxonomies),
      );
      localStorage.setItem("assign_terms", JSON.stringify(assign_terms));
      localStorage.setItem(
        "taxonomy_settings",
        JSON.stringify(taxonomy_settings),
      );

      return response.data;
    } catch (error) {
      console.error("EmulateLogin error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Emulation failed",
      );
    }
  },
);
