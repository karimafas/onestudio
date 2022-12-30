import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ItemDfo } from "../../objects/InventoryItem";
import { ItemRepository } from "../../repositories/ItemRepository";

export enum SnackType {
    success,
    error,
  }

// Define a type for the slice state
interface UiState {
  snackOpen: boolean;
  snackMessage: string;
  snackType: SnackType;
}

// Define the initial state using that type
const initialState: UiState = {
  snackOpen: false,
  snackMessage: "",
  snackType: SnackType.success,
};

export const updateItem = createAsyncThunk(
  "inventory/updateItem",
  async (data: ItemDfo) => {
    return await ItemRepository.updateItem(data);
  }
);

export const deleteItems = createAsyncThunk(
  "inventory/deleteItem",
  async (ids: Array<number>) => {
    return await ItemRepository.deleteItems(ids);
  }
);

export const counterSlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    openSnack: (
      state: UiState,
      action: PayloadAction<{ message: string; type: SnackType }>
    ) => {
      state.snackType = action.payload.type;
      state.snackMessage = action.payload.message;
      state.snackOpen = true;
    },
    closeSnack: (state: UiState) => {
      state.snackOpen = false;
    },
  },
});

export const { openSnack, closeSnack } = counterSlice.actions;

export default counterSlice.reducer;
