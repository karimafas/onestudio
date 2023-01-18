import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  current,
} from "@reduxjs/toolkit";
import { Category } from "../../objects/Category";
import { InventoryItem, ItemDfo } from "../../objects/InventoryItem";
import { Status } from "../../objects/Status";
import { StudioActivity } from "../../objects/StudioActivity";
import { StudioLocation } from "../../objects/StudioLocation";
import { StudioUser } from "../../objects/StudioUser";
import { TimelineEvent } from "../../objects/TimelineEvent";
import { ActivityRepository } from "../../repositories/ActivityRepository";
import { AuthRepository } from "../../repositories/AuthRepository";
import { CategoryRepository } from "../../repositories/CategoryRepository";
import { EventRepository } from "../../repositories/EventRepository";
import { ItemRepository } from "../../repositories/ItemRepository";
import { LocationRepository } from "../../repositories/LocationRepository";
import { StatusRepository } from "../../repositories/StatusRepository";

export interface CreateItemThunkPayload {
  item?: InventoryItem;
  events: TimelineEvent[];
  success: boolean;
}

// Define a type for the slice state
interface DataState {
  loading: boolean;
  loggedIn: boolean;
  user: StudioUser | undefined;
  studioUsers: StudioUser[];
  items: InventoryItem[];
  categories: Category[];
  locations: StudioLocation[];
  events: TimelineEvent[];
  statuses: Status[];
  activity: StudioActivity[];
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
  statuses: [],
  activity: [],
};

export const initialLoad = createAsyncThunk("users/initialLoad", async () => {
  const items: InventoryItem[] = await ItemRepository.getInventoryItems();
  const categories: Category[] = await CategoryRepository.getCategories();
  const locations: StudioLocation[] = await LocationRepository.getLocations();
  const studioUsers: StudioUser[] = await AuthRepository.getStudioUsers();
  const user = await AuthRepository.getCurrentUser();
  const events = await EventRepository.getStudioEvents();
  const statuses = await StatusRepository.getStatuses();
  const activity = await ActivityRepository.getStudioActivity();

  return {
    items: items,
    categories: categories,
    locations: locations,
    user: user,
    studioUsers: studioUsers,
    events: events,
    statuses: statuses,
    activity: activity,
  };
});

export const createItem = createAsyncThunk(
  "data/createItem",
  async (dfo: ItemDfo) => {
    // Creates item.
    const item = await ItemRepository.createItem(dfo);

    // Reloads events.
    let events: TimelineEvent[] = [];
    if (item.success && item.item)
      events = await EventRepository.getStudioEvents();

    return { item: item.item, events: events, success: item.success };
  }
);

export const loadItemComments = createAsyncThunk(
  "data/loadItemComments",
  async (item: InventoryItem) => {
    const i = item;
    await i.loadComments();
    return i;
  }
);

export const reloadItem = createAsyncThunk(
  "data/reloadItem",
  async (itemId: number) => {
    const i = await ItemRepository.getInventoryItem(itemId);
    await i?.loadComments();
    return i;
  }
);

export const reloadEvents = createAsyncThunk("data/reloadEvents", async () => {
  const events = await EventRepository.getStudioEvents();
  return events;
});

export const reloadUsers = createAsyncThunk("data/reloadUsers", async () => {
  return await AuthRepository.getStudioUsers();
});

export const reloadTypes = createAsyncThunk("data/reloadTypes", async () => {
  const categories: Category[] = await CategoryRepository.getCategories();
  const locations: StudioLocation[] = await LocationRepository.getLocations();
  const statuses: Status[] = await StatusRepository.getStatuses();

  return {
    categories: categories,
    locations: locations,
    statuses: statuses,
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
      state.statuses = payload.statuses;
      state.activity = payload.activity;
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
    builder.addCase(loadItemComments.fulfilled, (state: DataState, action) => {
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
    builder.addCase(reloadTypes.fulfilled, (state: DataState, action) => {
      const payload = action.payload;

      return {
        ...state,
        locations: [...payload.locations],
        categories: [...payload.categories],
        statuses: [...payload.statuses],
      };
    });
    builder.addCase(reloadUsers.fulfilled, (state: DataState, action) => {
      const payload = action.payload;
      Object.assign(state.studioUsers, payload);
    });
    builder.addCase(reloadEvents.fulfilled, (state: DataState, action) => {
      const payload = action.payload;
      Object.assign(state.events, payload);
    });
    builder.addCase(createItem.fulfilled, (state: DataState, action) => {
      if (!action.payload) return;

      const payload = action.payload;
      const events = payload.events;
      const item = payload.item;
      if (!item) return;

      const currentItems = [...state.items, item];

      // Sort alphabetically
      currentItems.sort((a, b) => (a.manufacturer > b.manufacturer ? 1 : -1));

      return {
        ...state,
        items: currentItems,
        events,
      };
    });
  },
});

export const { deleteDataItem } = counterSlice.actions;

export default counterSlice.reducer;
