import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const deleteSavedShowSheet = createAsyncThunk(
    "showSheet/delete",
    async ({ id }, { rejectWithValue }) => {
        try {
            const storedApiKey = localStorage.getItem('api-key');
            const apiKey = storedApiKey ? JSON.parse(storedApiKey) : null;

            if (!apiKey) {
                return rejectWithValue("API key not found");
            }


            const response = await axios.delete(
                `${import.meta.env.VITE_API_BASE_URL}api/delete-showsheet/${id}`,
                {
                    headers:
                    {
                        'api-key': apiKey
                    }
                }
            );
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch show sheets");
        }
    }
);
