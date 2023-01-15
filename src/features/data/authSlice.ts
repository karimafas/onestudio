import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthRepository } from "../../repositories/AuthRepository";

// Define a type for the slice state
interface AuthState {
  loading: boolean;
  authorised: boolean;
}

export const refreshToken = createAsyncThunk("auth/refreshToken", async () => {
  return await AuthRepository.refreshToken();
});

// Define the initial state using that type
const initialState: AuthState = {
  loading: true,
  authorised: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authorise: (state: AuthState) => {
      state.authorised = true;
    },
    unauthorise: (state: AuthState) => {
      state.authorised = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshToken.fulfilled, (state: AuthState, action) => {
      state.authorised = action.payload;
      state.loading = false;
    });
  },
});

export const { authorise, unauthorise } = authSlice.actions;

export default authSlice.reducer;
