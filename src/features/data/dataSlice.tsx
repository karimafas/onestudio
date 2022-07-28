import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ApiHelper } from "../../helpers/ApiHelper";
import { InventoryItem } from "../../objects/InventoryItem";

// Define a type for the slice state
interface DataState {
  loading: boolean;
  items: Array<InventoryItem>;
}

// Define the initial state using that type
const initialState: DataState = {
  loading: true,
  items: [],
};

export const initialLoad = createAsyncThunk(
  "users/fetchByIdStatus",
  async () => {
    const items: Array<{}> = await ApiHelper.getInventoryItems();
    return {
      items: items,
    };
  }
);

export const counterSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    deleteDataItem: (state: DataState, action: PayloadAction<number>) => {
      const changedItems = state.items;
      const id = action.payload;
      const index = changedItems.map((i) => i.id).indexOf(id);
      changedItems.splice(index, 1);

      Object.assign(state.items, changedItems);
    },
    replaceDataItem: (
      state: DataState,
      action: PayloadAction<InventoryItem>
    ) => {
      const item = action.payload;
      const index = state.items.map((i) => i.id).indexOf(item.id);
      Object.assign(state.items[index], item);
      return {
        ...state,
        items: [...state.items],
      };
    },
    selectItem: (
      state: DataState,
      action: PayloadAction<{
        id?: number;
        value?: boolean;
        selectAll: boolean;
      }>
    ) => {
      if (!action.payload.selectAll) {
        console.log(state.items);
        const id = action.payload.id!;
        const value = action.payload.value;

        const changedItem = state.items.filter((i) => i.id === id)[0];
        changedItem.selected = value!;

        const index = state.items.map((i) => i.id).indexOf(id);
        Object.assign(state.items[index], changedItem);
        return {
          ...state,
          items: [...state.items],
        };
      } else {
        const changedItems = state.items;
        const allItemsAreSelected =
          state.items.filter((i) => i.selected).length === state.items.length;

        if (allItemsAreSelected) {
          state.items.map((i) => (i.selected = false));
        } else {
          state.items.map((i) => (i.selected = true));
        }

        Object.assign(state.items, changedItems);
        return {
          ...state,
          items: [...state.items],
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initialLoad.fulfilled, (state: DataState, action) => {
      const payload = action.payload;
      state.items = payload.items.map((i) => InventoryItem.fromJson(i));
      console.log(state.items);
      state.loading = false;
    });
  },
});

export const { selectItem, deleteDataItem, replaceDataItem } =
  counterSlice.actions;

export default counterSlice.reducer;
