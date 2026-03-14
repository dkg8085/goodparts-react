import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const submitContactForm = createAsyncThunk(
  "contact/submitForm",
  async (formData, { rejectWithValue }) => {
    try {
      const storedApiKey = localStorage.getItem("api-key");
      let apiKey = storedApiKey ? JSON.parse(storedApiKey) : null;
      if (!apiKey) {
        return rejectWithValue("API key not found in session storage");
      }

      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      if (!user?.ID) {
        return rejectWithValue("User ID not found in session storage");
      }

      const payload = {
        userId: user.ID,
        form_id: 3,
        fields: formData, 
      };
     
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/submit-contact-form`,
        payload,
        {
          headers: {
            "api-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      return { formResponse: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to submit contact form"
      );
    }
  }
);
