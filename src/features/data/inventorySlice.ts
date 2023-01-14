import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ItemDfo } from "../../objects/InventoryItem";
import { ItemRepository } from "../../repositories/ItemRepository";

// Define a type for the slice state
interface InventoryState {
  search: string;
  drawer: boolean;
  loading: boolean;
}

// Define the initial state using that type
const initialState: InventoryState = {
  search: "",
  drawer: false,
  loading: false,
};

export const updateItem = createAsyncThunk(
  "inventory/updateItem",
  async (data: ItemDfo) => {
    return await ItemRepository.updateItem(data);
  }
);

export const deleteItems = createAsyncThunk(
  "inventory/deleteItem",
  async (ids: number[]) => {
    return await ItemRepository.deleteItems(ids);
  }
);

export const counterSlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    search: (state: InventoryState, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setDrawer: (state: InventoryState, action: PayloadAction<boolean>) => {
      state.drawer = action.payload;
    },
  },
});

export const { search, setDrawer } = counterSlice.actions;

export default counterSlice.reducer;
