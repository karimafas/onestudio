import { configureStore } from "@reduxjs/toolkit";
import dataSlice from "../features/data/dataSlice";
import inventorySlice from "../features/data/inventorySlice";

export const store = configureStore({
  reducer: {
    data: dataSlice,
    inventory: inventorySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
