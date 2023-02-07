import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/data/authSlice";
import dataSlice from "../features/data/dataSlice";
import fileUploadSlice from "../features/data/fileUploadSlice";
import filterSlice from "../features/data/filterSlice";
import uiSlice from "../features/data/uiSlice";

export const store = configureStore({
  reducer: {
    data: dataSlice,
    ui: uiSlice,
    auth: authSlice,
    filter: filterSlice,
    fileUpload: fileUploadSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
