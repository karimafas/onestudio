import { useAppSelector } from "../app/hooks";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { NotificationCard } from "./NotificationCard";

export function NotificationTray() {
  const notifications = useAppSelector((state) => state.data.notifications);

  return (
    <div className="absolute h-[80%] w-[23em] bg-white shadow-2xl rounded-md ml-[-20em] mt-2 flex flex-col overflow-auto">
      <span className="mt-4 ml-4 mb-3 text-dark_blue font-semibold text-lg">
        Notifications
      </span>
      {notifications.length === 0 ? (
        <div className="w-full h-full flex flex-col items-center pt-14">
          <img className="w-8" src={ImageHelper.image(Images.bellPurple)} />
          <span className="px-12 text-center text-xs mt-3 font-medium text-light_purple">
            Collaborate with your colleagues
            to see your first notification!
          </span>
        </div>
      ) : (
        <></>
      )}
      {notifications.map((n) => (
        <NotificationCard
          notification={n}
          key={`notification-${n.id}-${n.createdAt}`}
        />
      ))}
    </div>
  );
}
