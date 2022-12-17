import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ApiHelper } from "../../helpers/ApiHelper";
import { InventoryItem, ItemDfo } from "../../objects/InventoryItem";

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
  async (item: InventoryItem): Promise<{ success: boolean; id: any }> => {
    const response = await ApiHelper.createItem(item);
    return { success: response.success, id: response.id };
  }
);

export const updateItem = createAsyncThunk(
  "inventory/updateItem",
  async (data: ItemDfo) => {
    return await ApiHelper.updateItem(data);
  }
);

export const deleteItems = createAsyncThunk(
  "inventory/deleteItem",
  async (ids: Array<number>) => {
    return await ApiHelper.deleteItems(ids);
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