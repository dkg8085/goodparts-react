import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const saveShowSheetPost = createAsyncThunk(
    "saveShowSheet/saveShowSheetPost",
    async (showSheetId, { rejectWithValue }) => {
        try {
            const storedApiKey = localStorage.getItem('api-key');
            const apiKey = storedApiKey ? JSON.parse(storedApiKey) : null;
            const userString = localStorage.getItem("user");
            let user_id = '';

            if (userString) {
                const user = JSON.parse(userString);
                user_id = user.ID;
            }

            if (!apiKey) {
                return rejectWithValue("API key not found in session storage");
            }

            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}api/get-showsheet-posts?showsheet_id=${showSheetId}&user_id=${user_id}`,
                {
                    headers: {
                        'api-Key': apiKey,
                    },
                }
            );
            
            return response.data.data;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch post");
        }
    }
);
