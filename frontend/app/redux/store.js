import { configureStore } from "@reduxjs/toolkit";
import projectSlice from "./slices/projectSlice";
import mapSlice from "./slices/mapSlice";
import contentSlice from "./slices/contentSlice";

export const store = configureStore({
    reducer: {
        project: projectSlice,
        mapSide: mapSlice,
        displayContent: contentSlice,
    },
    
});

export default store;
