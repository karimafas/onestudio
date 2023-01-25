import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { viewNotification } from "../features/data/dataSlice";
import { Notification } from "../objects/Notification";
import { UserTag } from "./UserTag";

export function NotificationCard(props: { notification: Notification }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { notification } = props;

  const unseen = "bg-lightest_purple h-full w-full";
  const seen = "h-full w-full";

  return (
    <div
      className="w-full cursor-pointer min-h-[4em] border-b-[1px] border-b-light_grey hover:bg-lightest_purple2"
      onClick={() => {
        if (!notification.seen) dispatch(viewNotification(notification.id));
        navigate(`/inventory/${notification.itemId}/?comments=true`);
      }}
    >
      <div className={notification.seen ? seen : unseen}>
        <div className="flex flex-row w-full h-full items-center px-5">
          <div className="h-[2em] w-[2em]">
            <UserTag user={notification.user} />
          </div>
          <div className="grow pl-3 flex flex-col">
            <span className="text-xs text-dark_blue">
              {notification.drawerText}
            </span>
            <span className="text-[10px] font-medium text-grey mt-[2px]">
              {moment(notification.createdAt).format("D MMM yy, HH:mm")} •{" "}
              {notification.item?.manufacturer ?? ""}{" "}
              {notification.item?.model ?? ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
