import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { closeSnack, SnackType } from "../features/data/uiSlice";
import { ImageHelper, Images } from "../helpers/ImageHelper";

export function CustomSnackBar() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.ui.snackOpen);
  const type = useAppSelector((state) => state.ui.snackType);
  const message = useAppSelector((state) => state.ui.snackMessage);
  let timeout: any;

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    if (open) {
      setTimeout(() => {}, 5000);
    }
  }, [open]);

  function indicatorColor() {
    switch (type) {
      case SnackType.success:
        return "bg-green";
      case SnackType.error:
        return "bg-red";
    }
  }

  if (!open) return <></>;

  return (
    <div
      className={`w-full h-[100vh]
      } relative mt-[-100vh] flex flex-col justify-end align-start ${
        open ? "opacity-100" : "opacity-0"
      } transition-all duration-500 delay-500 ${
        open ? "translate-x-0" : "-translate-x-12"
      } pointer-events-none`}
    >
      <div className="pointer-events-auto h-12 w-80 bg-blue -translate-y-12 translate-x-20 rounded-xl shadow-xl flex flex-row justify-between p-4 items-center">
        <div className="flex flex-row items-center">
          <div className={`h-2 w-2 rounded-xl ${indicatorColor()} mr-4`}></div>
          <span className="text-xs text-white font-semibold">{message}</span>
        </div>
        <img
          onClick={() => dispatch(closeSnack())}
          className="w-3 opacity-50 cursor-pointer"
          src={ImageHelper.image(Images.closeWhite)}
        />
      </div>
    </div>
  );
}
