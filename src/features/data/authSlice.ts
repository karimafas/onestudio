import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface AuthState {
  authorised: boolean;
}

// Define the initial state using that type
const initialState: AuthState = {
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
});

export const { authorise, unauthorise } = authSlice.actions;

export default authSlice.reducer;
