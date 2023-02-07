import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileRepository } from "../../repositories/FileRepository";

// Define a type for the slice state
interface FileUploadState {}

// Define the initial state using that type
const initialState: FileUploadState = {};

interface FileUploadPayload {
  file: any;
  itemId: number;
  commentId: number;
}

export const uploadFile = createAsyncThunk(
  "fileUpload/uploadFile",
  async (payload: FileUploadPayload) => {
    // Upload file to S3.
    const url = "testUrl";

    if (!url) return { success: false };

    // const dbResult = await FileRepository.createFile(
    //   url,
    //   payload.itemId,
    //   payload.commentId
    // );

    return { success: true, url: "testurl" };
  }
);

export const fileUploadSlice = createSlice({
  name: "fileUpload",
  initialState,
  reducers: {},
  extraReducers: {},
});

export const {} = fileUploadSlice.actions;

export default fileUploadSlice.reducer;
