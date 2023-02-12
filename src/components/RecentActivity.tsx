import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loadMoreActivity } from "../features/data/dataSlice";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { ActivityType, StudioActivity } from "../objects/StudioActivity";
import { PrimaryButton } from "./PrimaryButton";

export enum RecentActivityType {
  dashboard,
  item,
}

interface DashboardEventData {
  text: string;
  image: any;
}

export function RecentActivity(props: {
  type: RecentActivityType;
  activity: StudioActivity[];
  style?: string;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const users = useAppSelector((state) => state.data.studioUsers);
  const activityCount = useAppSelector((state) => state.data.activityCount);
  const loadedActivity = useAppSelector((state) => state.data.activity);

  function eventData(e: StudioActivity): DashboardEventData {
    switch (e.type) {
      case ActivityType.creation:
        return {
          text: `created ${
            props.type === RecentActivityType.dashboard
              ? "an inventory"
              : "this"
          } item.`,
          image: ImageHelper.image(Images.addWhite),
        };
      case ActivityType.edit:
        return {
          text: `edited  ${
            props.type === RecentActivityType.dashboard
              ? "an inventory"
              : "this"
          }  item.`,
          image: ImageHelper.image(Images.edit),
        };
      case ActivityType.duplication:
        return {
          text: `duplicated  ${
            props.type === RecentActivityType.dashboard
              ? "an inventory"
              : "this"
          }  item.`,
          image: ImageHelper.image(Images.duplicateWhite),
        };
      case ActivityType.comment:
        return {
          text: `added a comment to  ${
            props.type === RecentActivityType.dashboard
              ? "an inventory"
              : "this"
          }  item.`,
          image: ImageHelper.image(Images.commentWhite),
        };
      case ActivityType.statusChange:
        return {
          text: `changed the status of  ${
            props.type === RecentActivityType.dashboard
              ? "an inventory"
              : "this"
          }  item.`,
          image: ImageHelper.image(Images.changeWhite),
        };
      case ActivityType.invitation:
        return {
          text: "invited a new user to the team.",
          image: ImageHelper.image(Images.usersWhite),
        };
    }
  }

  function getUser(a: StudioActivity) {
    const u = users.filter((u) => u.id === a.userId)[0];
    return `${u?.firstName ?? ""} ${u?.lastName ?? ""}`;
  }

  return (
    <div className="flex flex-col w-full h-full py-8">
      <div
        className={
          props.style ??
          "w-full h-full border-dashed border-lightest_purple border-4 rounded-2xl flex flex-col p-8 overflow-auto"
        }
      >
        <span className="font-bold text-xl text-dark_blue mb-6">
          Recent activity
        </span>
        {props.activity.map((a) => (
          <div
            key={`${a.type}-${a.createdAt}-${a.itemId}`}
            onClick={() => {
              if (props.type === RecentActivityType.item) return;
              if (!a.itemId) return;
              navigate(
                `inventory/${a.itemId}${
                  a.type === ActivityType.comment ? "/?comments=true" : ""
                }`
              );
            }}
            className={`flex flex-row items-center w-full mb-4 ${
              props.type === RecentActivityType.dashboard && a.itemId
                ? "cursor-pointer"
                : "cursor-default"
            }`}
          >
            <div className="min-h-[33px] min-w-[33px] bg-light_blue rounded-xl flex flex-col justify-center items-center">
              <img className="w-[14px]" src={eventData(a).image} />
            </div>
            <div className="flex flex-col ml-4 justify-center">
              <span className="text-[11px] font-medium text-light_blue mb-1">
                {moment(a.createdAt).format("DD/MM/YY, HH:mm")}
              </span>
              <span className="text-xs font-medium text-light_purple">
                {getUser(a)} {eventData(a).text}
              </span>
            </div>
          </div>
        ))}
        {loadedActivity.length < activityCount ? (
          <div className="flex flex-row w-full justify-center mt-4">
            <PrimaryButton
              text="Load more"
              onClick={() => dispatch(loadMoreActivity())}
              size="small"
              icon={ImageHelper.image(Images.spinner)}
              iconStyle="w-[12px]"
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
