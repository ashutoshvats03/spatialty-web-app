import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mapSide: "LHS",
};

const mapSlice = createSlice({
    name: "mapSide",
    initialState,
    reducers: {
        setMapSide: (state, action) => {
            state.mapSide = action.payload;
        },
    },
});

export const { setMapSide } = mapSlice.actions; // Ensure this export exists
export default mapSlice.reducer; // Ensure default reducer export
