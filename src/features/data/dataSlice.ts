import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../../objects/Category";
import { InventoryItem } from "../../objects/InventoryItem";
import { StudioLocation } from "../../objects/StudioLocation";
import { StudioUser } from "../../objects/StudioUser";
import { TimelineEvent } from "../../objects/TimelineEvent";
import { AuthRepository } from "../../repositories/AuthRepository";
import { CategoryRepository } from "../../repositories/CategoryRepository";
import { EventRepository } from "../../repositories/EventRepository";
import { ItemRepository } from "../../repositories/ItemRepository";
import { LocationRepository } from "../../repositories/LocationRepository";

// Define a type for the slice state
interface DataState {
  loading: boolean;
  loggedIn: boolean;
  user: StudioUser | undefined;
  studioUsers: Array<StudioUser>;
  items: Array<InventoryItem>;
  categories: Array<Category>;
  locations: Array<StudioLocation>;
  events: Array<TimelineEvent>;
}

// Define the initial state using that type
const initialState: DataState = {
  loading: true,
  loggedIn: false,
  user: undefined,
  studioUsers: [],
  items: [],
  categories: [],
  locations: [],
  events: [],
};

export const initialLoad = createAsyncThunk("users/initialLoad", async () => {
  const items: Array<InventoryItem> = await ItemRepository.getInventoryItems();
  const categories: Array<Category> = await CategoryRepository.getCategories();
  const locations: Array<StudioLocation> =
    await LocationRepository.getLocations();
  const studioUsers: Array<StudioUser> = await AuthRepository.getStudioUsers();
  const user = await AuthRepository.getCurrentUser();
  const events = await EventRepository.getStudioEvents();

  return {
    items: items,
    categories: categories,
    locations: locations,
    user: user,
    studioUsers: studioUsers,
    events: events,
  };
});

export const loadItemEvents = createAsyncThunk(
  "users/loadItemEvents",
  async (item: InventoryItem) => {
    return item;
  }
);

export const reloadItem = createAsyncThunk(
  "users/reloadItem",
  async (itemId: number) => {
    return await ItemRepository.getInventoryItem(itemId);
  }
);

export const reloadUsers = createAsyncThunk("users/reloadUsers", async () => {
  return await AuthRepository.getStudioUsers();
});

export const reloadTypes = createAsyncThunk("users/reloadTypes", async () => {
  const categories: Array<Category> = await CategoryRepository.getCategories();
  const locations: Array<StudioLocation> =
    await LocationRepository.getLocations();

  return {
    categories: categories,
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
      state.user = payload.user;
      state.studioUsers = payload.studioUsers;
      state.events = payload.events;
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

      return {
        ...state,
        locations: [...payload.locations],
        categories: [...payload.categories],
      };
    });
    builder.addCase(reloadUsers.fulfilled, (state: DataState, action) => {
      const payload = action.payload;
      Object.assign(state.studioUsers, payload);
    });
  },
});

export const { selectItem, deleteDataItem, replaceDataItem } =
  counterSlice.actions;

export default counterSlice.reducer;
