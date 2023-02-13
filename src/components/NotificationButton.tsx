import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../app/hooks";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { NotificationTray } from "./NotificationTray";

export function NotificationButton() {
  const notifications = useAppSelector((state) => state.data.notifications);
  const [notificationBox, setNotificationBox] = useState<boolean>(false);

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        notificationBox && setNotificationBox(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [notificationBox]);

  return (
    <div
      className="h-[3em] w-[2.6em]"
      onClick={() => setNotificationBox(!notificationBox)}
      ref={ref}
    >
      <div className="w-[2.3em] h-[2.3em] bg-blue transition-all hover:bg-dark_blue rounded-lg shadow-xl flex flex-col items-center justify-center cursor-pointer">
        <img width="40%" src={ImageHelper.image(Images.bellWhite)} />
      </div>
      {notifications.filter((n) => !n.seen).length > 0 ? (
        <div className="flex flex-row justify-end">
          <div className="relative bg-red rounded-[100%] mt-[-10px] h-[1em] w-[1em] flex flex-col items-center justify-center cursor-pointer">
            <span className="text-white font-bold text-[9px]">
              {notifications.filter((n) => !n.seen).length}
            </span>
          </div>
        </div>
      ) : (
        <></>
      )}
      {notificationBox ? <NotificationTray /> : <></>}
    </div>
  );
}
