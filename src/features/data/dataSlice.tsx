import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ApiHelper } from "../../helpers/ApiHelper";
import { Category } from "../../objects/Category";
import { InventoryItem } from "../../objects/InventoryItem";
import { Owner } from "../../objects/Owner";
import { StudioLocation } from "../../objects/StudioLocation";
import { TimelineUser } from "../../objects/TimelineUser";

// Define a type for the slice state
interface DataState {
  loading: boolean;
  loggedIn: boolean;
  user: TimelineUser | undefined;
  items: Array<InventoryItem>;
  categories: Array<Category>;
  owners: Array<Owner>;
  locations: Array<StudioLocation>;
}

// Define the initial state using that type
const initialState: DataState = {
  loading: true,
  loggedIn: false,
  user: undefined,
  items: [],
  categories: [],
  owners: [],
  locations: [],
};

export const initialLoad = createAsyncThunk("users/initialLoad", async () => {
  const items: Array<InventoryItem> = await ApiHelper.getInventoryItems();
  const categories: Array<Category> = await ApiHelper.getCategories();
  const owners: Array<Owner> = await ApiHelper.getOwners();
  const locations: Array<StudioLocation> = await ApiHelper.getLocations();
  const user = await ApiHelper.getCurrentUser();

  return {
    items: items,
    categories: categories,
    owners: owners,
    locations: locations,
    user: user,
  };
});

export const loadItemEvents = createAsyncThunk(
  "users/loadItemEvents",
  async (item: InventoryItem) => {
    await item.initEvents();
    return item;
  }
);

export const reloadItem = createAsyncThunk(
  "users/reloadItem",
  async (itemId: number) => {
    const item = await ApiHelper.getInventoryItem(itemId);
    if (item) {
      await item!.initEvents();
      await item!.loadUser();
    }
    return item;
  }
);

export const reloadTypes = createAsyncThunk("users/reloadTypes", async () => {
  const categories: Array<Category> = await ApiHelper.getCategories();
  const owners: Array<Owner> = await ApiHelper.getOwners();
  const locations: Array<StudioLocation> = await ApiHelper.getLocations();

  return {
    categories: categories,
    owners: owners,
    locations: locations,
  };
});

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
      state.items = payload.items;
      state.categories = payload.categories;
      state.locations = payload.locations;
      state.owners = payload.owners;
      state.user = payload.user;
      state.loading = false;
    });
    builder.addCase(reloadItem.fulfilled, (state: DataState, action) => {
      const payload: InventoryItem | undefined = action.payload;

      if (payload) {
        const index = state.items.map((i) => i.id).indexOf(payload.id);
        Object.assign(state.items[index], payload);
      }

      return {
        ...state,
        items: [...state.items],
      };
    });
    builder.addCase(loadItemEvents.fulfilled, (state: DataState, action) => {
      const payload: InventoryItem = action.payload;
      const index = state.items.map((i) => i.id).indexOf(payload.id);
      Object.assign(state.items[index], payload);
      return {
        ...state,
        items: [...state.items],
      };
    });
    builder.addCase(reloadTypes.fulfilled, (state: DataState, action) => {
      const payload = action.payload;
      Object.assign(state.locations, payload.locations);
      Object.assign(state.categories, payload.categories);
      Object.assign(state.owners, payload.owners);
    });
  },
});

export const { selectItem, deleteDataItem, replaceDataItem } =
  counterSlice.actions;

export default counterSlice.reducer;
