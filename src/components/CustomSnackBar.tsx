import { Snackbar } from "@mui/material";
import { useEffect } from "react";
import { ImageHelper, Images } from "../helpers/ImageHelper";

export enum SnackType {
  updateSuccess,
  updateError,
  createSuccess,
  createError,
}

export interface SnackState {
  type: SnackType;
  open: boolean;
}

export function CustomSnackBar(props: {
  state: SnackState;
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
      case SnackType.updateSuccess:
        return "Item updated successfully.";
      case SnackType.updateError:
        return "There was an error updating this item.";
      case SnackType.createSuccess:
        return "Item created successfully.";
      case SnackType.createError:
        return "There was an error creating this item.";
    }
  }

  function indicatorColor() {
    switch (props.state.type) {
      case SnackType.updateSuccess:
      case SnackType.createSuccess:
        return "bg-green";
      case SnackType.updateError:
      case SnackType.createError:
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
          src={ImageHelper.image(Images.closeWhite)}
        />
      </div>
    </div>
  );
}
