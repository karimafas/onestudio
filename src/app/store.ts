import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../reducers/authSlice";
import dataSlice from "../reducers/dataSlice";
import fileUploadSlice from "../reducers/fileUploadSlice";
import filterSlice from "../reducers/filterSlice";
import uiSlice from "../reducers/uiSlice";

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
