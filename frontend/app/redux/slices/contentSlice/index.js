import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    displayContent: true,
};

const contentSlice = createSlice({
    name: "displayContent",
    initialState,
    reducers: {
        setdisplayContent: (state, action) => {
            state.displayContent = action.payload;
        },
    },
});

export const { setdisplayContent } = contentSlice.actions; // Ensure this export exists
export default contentSlice.reducer; // Ensure default reducer export
