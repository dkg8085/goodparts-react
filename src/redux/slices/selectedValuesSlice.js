import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    values: JSON.parse(localStorage.getItem("selectedTaxonomies")) || [], 
};

const selectedValuesSlice = createSlice({
    name: "selectedValues",
    initialState,
    reducers: {
        toggleValue: (state, action) => {
            const value = action.payload;
            if (state.values.includes(value)) {
                state.values = state.values.filter((v) => v !== value); 
            } else {
                state.values.push(value); 
            }
            localStorage.setItem("selectedTaxonomies", JSON.stringify(state.values));
        },
        resetValues: (state) => {
            state.values = []; 
            localStorage.removeItem("selectedTaxonomies");
        },
        selectAllValues: (state, action) => {
            state.values = action.payload; 
            localStorage.setItem("selectedTaxonomies", JSON.stringify(state.values));
        },
        deselectAllValues: (state) => {
            state.values = []; 
            localStorage.removeItem("selectedTaxonomies");
        }
    },
});

export const { toggleValue, resetValues, selectAllValues, deselectAllValues } = selectedValuesSlice.actions;
export default selectedValuesSlice.reducer;
