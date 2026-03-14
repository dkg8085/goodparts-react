import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSearchPost = createAsyncThunk(
    "searchPost/fetch",
    async ({ searchKeyword, fromDate, toDate, selectedCategories, filter_media, page = 1, per_page = 10 }, { rejectWithValue }) => {
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

            const assignTaxonomy = localStorage.getItem('assign_taxonomies');
            let parsedValue;
            try {
                parsedValue = assignTaxonomy ? JSON.parse(assignTaxonomy) : null;
            } catch (error) {
                console.error("Error parsing assignTaxonomy:", error);
                parsedValue = null;
            }

            const payload = {
                categories: selectedCategories,
                search: searchKeyword,
                start_date: fromDate,
                end_date: toDate,
                user_id: user_id,
                assign_taxonomies: parsedValue,
                filter_media,
                page,
                per_page
            };

            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}api/advance-search`,
                payload,
                {
                    headers: {
                        'api-Key': apiKey,
                    },
                }
            );
            return {
                data: response.data.data,
                pagination: response.data.pagination
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch post");
        }
    }
);