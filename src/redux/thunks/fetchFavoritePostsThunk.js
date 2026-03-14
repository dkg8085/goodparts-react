import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchFavoritePostList = createAsyncThunk(
    "favorites/fetchFavoriteList",
    async (_, { rejectWithValue }) => {
        try {

            const storedApiKey = localStorage.getItem('api-key');
            const apiKey = storedApiKey ? JSON.parse(storedApiKey) : null;
            const assignTaxonomy = localStorage.getItem('assign_taxonomies');
            const assignTaxonomyData = assignTaxonomy ? JSON.parse(assignTaxonomy) : null;
            const assignTaxonomyName = assignTaxonomyData ? assignTaxonomyData[0] : null;
            const userString = localStorage.getItem("user");
            const user = userString ? JSON.parse(userString) : null;

            if (!user?.ID) {
                return rejectWithValue("User ID not found in session storage");
            }

            if (!apiKey) {
                return rejectWithValue("API key not found in session storage");
            }

            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}wp/v2/favoritelist/?user=${user?.ID}`,
                {
                    headers: {
                        'api-Key': apiKey,
                    },
                }
            );

            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch taxonomy terms");
        }
    }
);
