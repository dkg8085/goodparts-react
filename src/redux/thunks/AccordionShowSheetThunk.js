import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const accordionShowSheet = createAsyncThunk(
    "accordionShowSheet/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const storedApiKey = localStorage.getItem('api-key');
            const apiKey = storedApiKey ? JSON.parse(storedApiKey) : null;

            if (!apiKey) {
                return rejectWithValue("API key not found");
            }

            const userString = localStorage.getItem("user");
            const user = userString ? JSON.parse(userString) : null;
            const user_id = user?.ID;

            if (!user_id) {
                return rejectWithValue("User ID not found");
            }

            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}api/showsheet_tag_posts/?user_id=${user_id}`,
                {
                    headers:
                        { 'api-key': apiKey }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch show sheets");
        }
    }
);
