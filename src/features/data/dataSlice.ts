import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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
import { CommentRepository } from "../../repositories/CommentRepository";
import { EventRepository } from "../../repositories/EventRepository";
import { ItemRepository } from "../../repositories/ItemRepository";
import { LocationRepository } from "../../repositories/LocationRepository";
import { StatusRepository } from "../../repositories/StatusRepository";
import { Comment } from "../../objects/Comment";
import { NotificationRepository } from "../../repositories/NotificationRepository";
import { Notification } from "../../objects/Notification";

export interface CreateCommentPayload {
  itemId: number;
  body: string;
}

export interface DeleteCommentPayload {
  itemId: number;
  commentId: number;
}

export interface UpdateCommentPayload {
  commentId: number;
  body: string;
}

export interface ChangeStatusPayload {
  itemId: number;
  statusId: number;
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
  notifications: Notification[];
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
  notifications: [],
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
  const notifications = await NotificationRepository.getNotifications();
  notifications.map((n) => n.initialise(studioUsers, items));

  return {
    items,
    categories,
    locations,
    user,
    studioUsers,
    events,
    statuses,
    activity,
    notifications,
  };
});

export const createItem = createAsyncThunk(
  "data/createItem",
  async (dfo: ItemDfo) => {
    // Creates item.
    const result = await ItemRepository.createItem(dfo);

    return { item: result.item, success: result.success };
  }
);

export const duplicateItem = createAsyncThunk(
  "data/duplicateItem",
  async (id: number) => {
    // Creates item.
    const result = await ItemRepository.duplicateItem(id);

    return { item: result.item, success: result.success };
  }
);

export const createComment = createAsyncThunk(
  "data/createComment",
  async (payload: CreateCommentPayload) => {
    // Creates comment.
    const result = await CommentRepository.createComment(
      payload.itemId,
      payload.body
    );

    return { comment: result.comment, success: result.success };
  }
);

export const deleteComment = createAsyncThunk(
  "data/deleteComment",
  async (payload: DeleteCommentPayload) => {
    // Deletes comment.
    const result = await CommentRepository.deleteComment(payload.commentId);

    return {
      success: result,
      commentId: payload.commentId,
      itemId: payload.itemId,
    };
  }
);

export const updateComment = createAsyncThunk(
  "data/updateComment",
  async (payload: UpdateCommentPayload) => {
    // Updates comment.
    const result = await CommentRepository.updateComment(
      payload.commentId,
      payload.body
    );

    return {
      success: result,
      comment: result.comment,
    };
  }
);

export const getLastUserActivity = createAsyncThunk(
  "data/getLastUserActivity",
  async (_, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const data = state.data as DataState;
    if (!data.user) return;
    const userId = data.user?.id;

    // Gets last activity for the current user.
    const result = await ActivityRepository.lastUserActivity(userId);

    return { activity: result.activity, success: result.success };
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

export const changeStatus = createAsyncThunk(
  "data/changeStatus",
  async (payload: ChangeStatusPayload) => {
    const result = await StatusRepository.changeStatus(
      payload.statusId,
      payload.itemId
    );

    return { success: result.success, item: result.item };
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

export const viewNotification = createAsyncThunk(
  "data/viewNotification",
  async (id: number) => {
    const result = await NotificationRepository.viewNotification(id);

    return { notification: result.notification, success: result.success };
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
      state.notifications = payload.notifications;
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
      if (!action.payload.success) return;

      const payload = action.payload;
      const item = payload.item;
      if (!item) return;

      const currentItems = [...state.items, item];

      // Sort alphabetically
      currentItems.sort((a, b) => (a.manufacturer > b.manufacturer ? 1 : -1));

      return {
        ...state,
        items: currentItems,
      };
    });
    builder.addCase(duplicateItem.fulfilled, (state: DataState, action) => {
      if (!action.payload) return;
      if (!action.payload.success) return;

      const payload = action.payload;
      const item = payload.item;
      if (!item) return;

      const currentItems = [...state.items, item];

      // Sort alphabetically
      currentItems.sort((a, b) => (a.manufacturer > b.manufacturer ? 1 : -1));

      return {
        ...state,
        items: currentItems,
      };
    });
    builder.addCase(
      getLastUserActivity.fulfilled,
      (state: DataState, action) => {
        if (!action.payload) return;
        if (!action.payload.success) return;
        const activity = action.payload.activity;
        if (!activity) return;

        const _activity: StudioActivity[] = [activity, ...state.activity];

        return {
          ...state,
          activity: _activity,
        };
      }
    );
    builder.addCase(createComment.fulfilled, (state: DataState, action) => {
      if (!action.payload) return;
      if (!action.payload.success) return;
      const comment = action.payload.comment;
      if (!comment) return;

      const item = state.items.filter((i) => i.id === comment.itemId)[0];
      const _comments: Comment[] = [comment, ...item.comments];
      item.comments = _comments;

      const items = [...state.items];
      const index = items.map((i) => i.id).indexOf(item.id);
      items[index] = item;

      return {
        ...state,
        items: items,
      };
    });
    builder.addCase(deleteComment.fulfilled, (state: DataState, action) => {
      if (!action.payload) return;
      if (!action.payload.success) return;
      const itemId = action.payload.itemId;
      const commentId = action.payload.commentId;

      const item = state.items.filter((i) => i.id === itemId)[0];
      const _comments: Comment[] = [...item.comments];
      const index = _comments.map((c) => c.id).indexOf(commentId);
      _comments.splice(index, 1);
      item.comments = _comments;

      const items = [...state.items];

      return {
        ...state,
        items: items,
      };
    });
    builder.addCase(updateComment.fulfilled, (state: DataState, action) => {
      if (!action.payload) return;
      if (!action.payload.success) return;
      const comment = action.payload.comment;
      if (!comment) return;

      const item = state.items.filter((i) => i.id === comment.itemId)[0];
      const _comments: Comment[] = [...item.comments];
      const commentIndex = _comments.map((c) => c.id).indexOf(comment.id);
      _comments[commentIndex] = comment;
      item.comments = _comments;

      const items = [...state.items];
      const index = items.map((i) => i.id).indexOf(item.id);
      items[index] = item;

      return {
        ...state,
        items: items,
      };
    });
    builder.addCase(viewNotification.fulfilled, (state: DataState, action) => {
      if (!action.payload) return;
      if (!action.payload.success) return;
      const notification = action.payload.notification;
      if (!notification) return;

      notification.initialise(state.studioUsers, state.items);

      const _notifications = [...state.notifications];
      const index = _notifications.map((n) => n.id).indexOf(notification.id);
      _notifications[index] = notification;

      return {
        ...state,
        notifications: _notifications,
      };
    });
    builder.addCase(changeStatus.fulfilled, (state: DataState, action) => {
      if (!action.payload) return;
      if (!action.payload.success) return;
      const item = action.payload.item;
      if (!item) return;

      const _items = [...state.items];
      const index = _items.map((i) => i.id).indexOf(item.id);
      _items[index].status = item.status;

      return {
        ...state,
        items: _items,
      };
    });
  },
});

export const { deleteDataItem } = counterSlice.actions;

export default counterSlice.reducer;
