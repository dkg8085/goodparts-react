import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const toggleFavorite = createAsyncThunk(
    "favorites/fetchFavorite",
    async ({ postId, action , categoriesName }, { rejectWithValue }) => {
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
                `${import.meta.env.VITE_API_BASE_URL}wp/v2/favorite/?user_id=${user_id}&post_id=${postId}&action=${action}&category=${categoriesName}`,
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
