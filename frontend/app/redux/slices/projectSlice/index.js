import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    project: "one",
};

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        setProject: (state, action) => {
            state.project = action.payload;
        },
    },
}); 

export const { setProject } = projectSlice.actions;

export default projectSlice.reducer;