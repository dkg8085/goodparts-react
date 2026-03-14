import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const updateShowSheet = createAsyncThunk(
    "showSheet/updateShowSheet",
    async (showsheetdata, { rejectWithValue }) => {
        try {
            const storedApiKey = localStorage.getItem('api-key');
            const apiKey = storedApiKey ? JSON.parse(storedApiKey) : null;

            if (!apiKey) {
                return rejectWithValue("API key not found in session storage");
            }

            const userString = localStorage.getItem("user");

            const user = userString ? JSON.parse(userString) : null;
            const user_id = user?.ID;
            if (!user_id) {
                return rejectWithValue("User ID not found in session storage");
            }
            
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}api/add-remove-existingshowsheet?user_id=${user_id}&post_id=${showsheetdata.itemId}&showsheet_ids=${showsheetdata.selectedShowSheets}&action=${showsheetdata.action}`,
                {
                    headers: {
                        'api-key': apiKey,
                    }
                }
            );
            return response.data;
            
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch show sheets");
        }
    }
);