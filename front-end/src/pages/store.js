// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./services/apiService";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
