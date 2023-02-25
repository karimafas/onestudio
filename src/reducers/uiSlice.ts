import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum SnackType {
  success,
  error,
}

// Define a type for the slice state
interface UiState {
  snackOpen: boolean;
  snackMessage: string;
  snackType: SnackType;
  loading: boolean;
}

// Define the initial state using that type
const initialState: UiState = {
  snackOpen: false,
  snackMessage: "",
  snackType: SnackType.success,
  loading: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openSnack: (
      state: UiState,
      action: PayloadAction<{ message: string; type: SnackType }>
    ) => {
      state.snackType = action.payload.type;
      state.snackMessage = action.payload.message;
      state.snackOpen = true;
    },
    closeSnack: (state: UiState) => {
      state.snackOpen = false;
    },
    startLoading: (state: UiState) => {
      state.loading = true;
    },
    stopLoading: (state: UiState) => {
      state.loading = false;
    },
  },
});

export const { openSnack, closeSnack, startLoading, stopLoading } =
  uiSlice.actions;

export default uiSlice.reducer;
