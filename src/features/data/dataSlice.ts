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
import { FileRepository } from "../../repositories/FileRepository";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../../firebaseConfig";
import { FileUpload } from "../../objects/FileUpload";
import { Studio } from "../../objects/Studio";

export interface CreateCommentPayload {
  itemId: number;
  body: string;
  attachments: any[];
}

export interface DeleteCommentPayload {
  itemId: number;
  commentId: number;
}

export interface UpdateCommentPayload {
  itemId: number;
  commentId: number;
  body: string;
  deletedAttachments: FileUpload[];
  attachments: any[];
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
  activityCount: number;
  skipActivity: number;
  notifications: Notification[];
  forceUpdate: number;
  studio: Studio | undefined;
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
  activityCount: 0,
  skipActivity: 10,
  notifications: [],
  forceUpdate: 0,
  studio: undefined,
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
  const activityCount = await ActivityRepository.getStudioActivityCount();
  const notifications = await NotificationRepository.getNotifications();
  const studio = await AuthRepository.getStudio();
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
    activityCount,
    notifications,
    studio,
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

async function uploadTaskPromise(
  path: string,
  itemId: number,
  attachment: File
): Promise<string | undefined> {
  if (!attachment) return;

  return new Promise(function (resolve, reject) {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, attachment);
    uploadTask.on(
      "state_changed",
      (_) => {},
      (err) => reject(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          resolve(url);
        });
      }
    );
  });
}

async function uploadAttachments(
  attachments: any,
  itemId: number,
  commentId: number
) {
  // Creates attachment records on db.
  for (const attachment of attachments) {
    if (!attachment.id) {
      const path = `/attachments/${itemId}_${
        attachment.name
      }_${new Date().getTime()}`;

      // Uploads attachment to Google Storage.
      const url: string | undefined = await uploadTaskPromise(
        path,
        itemId,
        attachment
      );

      if (url) {
        // Create db record for attachment.
        await FileRepository.createFile(
          attachment.name,
          path,
          url,
          commentId,
          itemId
        );
      }
    }
  }
}

export const createComment = createAsyncThunk(
  "data/createComment",
  async (payload: CreateCommentPayload) => {
    // Creates comment.
    const result = await CommentRepository.createComment(
      payload.itemId,
      payload.body
    );

    if (!result?.comment) return { succes: false };

    try {
      await uploadAttachments(
        payload.attachments,
        payload.itemId,
        result.comment.id
      );
    } catch (e) {
      console.error("Error uploading attachments", e);
    }

    const commentWithAttachments = await CommentRepository.getComment(
      result.comment.id
    );

    return {
      comment: commentWithAttachments.comment,
      success: commentWithAttachments.success,
    };
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

    if (!result.success) return { result: false };
    if (!result.comment) return { result: false };

    // Delete attachments if required.
    if (payload.deletedAttachments.length > 0)
      await FileRepository.deleteAttachments(payload.deletedAttachments);

    await uploadAttachments(
      payload.attachments,
      payload.itemId,
      result.comment.id
    );

    const commentWithAttachments = await CommentRepository.getComment(
      result.comment.id
    );

    return {
      success: commentWithAttachments.success,
      comment: commentWithAttachments.comment,
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

export const reloadStatus = createAsyncThunk(
  "data/reloadStatus",
  async (itemId: number) => {
    const result = await StatusRepository.getItemStatus(itemId);

    return { success: result.success, status: result.status, itemId: itemId };
  }
);

export const reloadEvents = createAsyncThunk("data/reloadEvents", async () => {
  const events = await EventRepository.getStudioEvents();
  return events;
});

export const reloadUsers = createAsyncThunk("data/reloadUsers", async () => {
  return await AuthRepository.getStudioUsers();
});

export const loadMoreActivity = createAsyncThunk(
  "data/loadMoreActivity",
  async (_, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const data = state.data as DataState;
    return await ActivityRepository.getStudioActivity(data.skipActivity);
  }
);

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
      const changedItems = [...state.items];
      const id = action.payload;
      const index = changedItems.map((i) => i.id).indexOf(id);
      changedItems.splice(index, 1);
      let changedActivity = [...state.activity];
      changedActivity = changedActivity.filter((a) => a.itemId !== id);

      return { ...state, items: changedItems, activity: changedActivity };
    },
    stopLoading(state: DataState) {
      state.loading = false;
    },
    deleteItemEvents(state: DataState, action: PayloadAction<number[]>) {
      let newActivity = [...state.activity];
      for (const id of action.payload) {
        newActivity = newActivity.filter((a) => a.itemId !== id);
      }
      return {
        ...state,
        activity: newActivity,
      };
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
      state.skipActivity = payload.activity.length;
      state.studio = payload.studio.studio;
      if (payload.activityCount) state.activityCount = payload.activityCount;
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
    builder.addCase(reloadStatus.fulfilled, (state: DataState, action) => {
      if (!action.payload) return;
      if (!action.payload.success) return;
      const status = action.payload.status;
      if (!status) return;

      const _items = [...state.items];
      const index = _items.map((i) => i.id).indexOf(action.payload.itemId);
      _items[index].status = status;

      return {
        ...state,
        items: _items,
        forceUpdate: state.forceUpdate + 1,
      };
    });
    builder.addCase(loadMoreActivity.fulfilled, (state: DataState, action) => {
      if (!action.payload) return;
      const activity = action.payload;

      const _activity = [...state.activity, ...activity];

      return {
        ...state,
        activity: _activity,
        skipActivity: state.skipActivity + 10,
      };
    });
  },
});

export const { deleteDataItem, stopLoading } = counterSlice.actions;

export default counterSlice.reducer;
