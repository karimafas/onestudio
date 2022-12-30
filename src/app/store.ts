import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/data/authSlice";
import dataSlice from "../features/data/dataSlice";
import inventorySlice from "../features/data/inventorySlice";
import uiSlice from "../features/data/uiSlice";

export const store = configureStore({
  reducer: {
    data: dataSlice,
    inventory: inventorySlice,
    ui: uiSlice,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
