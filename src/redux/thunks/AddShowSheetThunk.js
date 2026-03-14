import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const toggleShowSheet = createAsyncThunk(
    "showSheet/toggleShowSheet", 
    async ({ postId, action }, { rejectWithValue }) => {
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
                `${import.meta.env.VITE_API_BASE_URL}api/add-remove-showsheet-tag?user_id=${user_id}&post_id=${postId}&action=${action}`,
                {
                    headers: {
                        'api-Key': apiKey,
                    },
                }
            );

            return response.data; 
            
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch post");
        }
    }
);
