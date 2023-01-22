import { useAppSelector } from "../app/hooks";
import { NotificationCard } from "./NotificationCard";

export function NotificationTray() {
  const notifications = useAppSelector((state) => state.data.notifications);
  
  return (
    <div className="absolute h-[80%] w-[23em] bg-white shadow-2xl rounded-md ml-[-20em] mt-2 flex flex-col overflow-auto">
      <span className="mt-4 ml-4 mb-3 text-dark_blue font-semibold text-lg">
        Notifications
      </span>
      {notifications.map((n) => (
        <NotificationCard
          notification={n}
          key={`notification-${n.id}-${n.createdAt}`}
        />
      ))}
    </div>
  );
}
