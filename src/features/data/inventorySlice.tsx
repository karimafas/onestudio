import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ApiHelper } from "../../helpers/ApiHelper";
import { InventoryItem } from "../../objects/InventoryItem";

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

export const createItem = createAsyncThunk(
  "inventory/createItem",
  async (item: InventoryItem) => {
    return await ApiHelper.createItem(item);
  }
);

export const updateItem = createAsyncThunk(
  "inventory/updateItem",
  async (item: InventoryItem) => {
    return await ApiHelper.updateItem(item);
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
