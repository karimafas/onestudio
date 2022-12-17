import { Snackbar } from "@mui/material";
import { useEffect } from "react";

export enum UpdateSnackType {
  success,
  error,
}

export interface UpdateSnackState {
  type: UpdateSnackType;
  open: boolean;
}

export function UpdateSnack(props: {
  state: UpdateSnackState;
  handleClose: Function;
}) {
  let timeout: any;

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    if (props.state.open) {
      setTimeout(() => {
        props.handleClose();
      }, 5000);
    }
  }, [props.state.open]);

  function snackText() {
    switch (props.state.type) {
      case UpdateSnackType.success:
        return "Item updated successfully.";
      case UpdateSnackType.error:
        return "There was an error updating this item.";
    }
  }

  function indicatorColor() {
    switch (props.state.type) {
      case UpdateSnackType.success:
        return "bg-green";
      case UpdateSnackType.error:
        return "bg-red";
    }
  }

  return (
    <div
      className={`w-full h-[100vh]
      } relative mt-[-100vh] flex flex-col justify-end align-start ${
        props.state.open ? "opacity-100" : "opacity-0"
      } transition-all duration-500 ${
        props.state.open ? "translate-x-0" : "-translate-x-12"
      } pointer-events-none`}
    >
      <div className="pointer-events-auto h-12 w-80 bg-blue -translate-y-12 -translate-x-20 rounded-xl shadow-xl flex flex-row justify-between p-4 items-center">
        <div className="flex flex-row items-center">
          <div className={`h-2 w-2 rounded-xl ${indicatorColor()} mr-4`}></div>
          <span className="text-xs text-white font-semibold">
            {snackText()}
          </span>
        </div>
        <img
          onClick={() => props.handleClose()}
          className="w-3 opacity-50 cursor-pointer"
          src={require("../assets/images/close-white.png")}
        />
      </div>
    </div>
  );
}
