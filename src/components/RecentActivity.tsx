import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { ActivityType, StudioActivity } from "../objects/StudioActivity";
import { TimelineEvent } from "../objects/TimelineEvent";

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
  const users = useAppSelector((state) => state.data.studioUsers);
  const navigate = useNavigate();

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
          image: ImageHelper.image(Images.edit),
        };
      case ActivityType.comment:
        return {
          text: `added a comment to  ${
            props.type === RecentActivityType.dashboard
              ? "an inventory"
              : "this"
          }  item.`,
          image: ImageHelper.image(Images.edit),
        };
      case ActivityType.statusChange:
        return {
          text: `changed the status of  ${
            props.type === RecentActivityType.dashboard
              ? "an inventory"
              : "this"
          }  item.`,
          image: ImageHelper.image(Images.edit),
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
              navigate(`inventory/${a.itemId}`);
            }}
            className={`flex flex-row items-center w-full mb-4 ${
              props.type === RecentActivityType.dashboard
                ? "cursor-pointer"
                : "cursor-default"
            }`}
          >
            <div className="min-h-[33px] min-w-[33px] bg-light_blue rounded-lg flex flex-col justify-center items-center">
              <img className="w-[14px]" src={eventData(a).image} />
            </div>
            <div className="flex flex-col ml-4 justify-center">
              <span className="text-[11px] font-medium text-light_blue mb-1">
                {moment(a.createdAt).format("DD/MM/YY, HH:mm")}
              </span>
              <span className="text-sm font-medium text-light_purple">
                {getUser(a)} {eventData(a).text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
