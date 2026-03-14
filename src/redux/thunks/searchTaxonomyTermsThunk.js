import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSearchTaxonomyTerms = createAsyncThunk(
    "search/taxonomyTerms",
    async (_, { rejectWithValue }) => {
        try {

            const assignTaxonomy = localStorage.getItem('assign_taxonomies');
            const storedApiKey = localStorage.getItem('api-key');
            const apiKey = storedApiKey ? JSON.parse(storedApiKey) : null;
            const assignTaxonomyData = assignTaxonomy ? JSON.parse(assignTaxonomy) : null;
            const assignTaxonomyName = assignTaxonomyData[0];
            const userString = localStorage.getItem("user");
            const user = userString ? JSON.parse(userString) : null;

            if (!user?.ID) {
                return rejectWithValue("User ID not found in session storage");
            }

            if (!assignTaxonomyName) {
                return rejectWithValue("Taxonomy data not found in local storage");
            }
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}api/assign-taxonomy-terms?taxonomies=${assignTaxonomy}`,
                {
                    headers: {
                        'api-Key': apiKey,
                    },
                }
            );

            return response.data.terms;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch taxonomy terms");
        }
    }
);
