import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const CreateNewActionShowSheet = createAsyncThunk(
    'showsheet/CreateNewActionShowSheet',
    async (payload, { rejectWithValue }) => {

        const storedApiKey = localStorage.getItem('api-key');
        const apiKey = storedApiKey ? JSON.parse(storedApiKey) : null;

        if (!apiKey) {
            return rejectWithValue("API key not found");
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}api/add-section`,
                payload,
                {
                    headers:
                    {
                        'api-key': apiKey
                    }
                }
            );
            
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

