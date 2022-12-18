import moment from "moment";
import { useNavigate } from "react-router-dom";
import { TimelineEvent, TimelineEventType } from "../objects/TimelineEvent";

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
  events: TimelineEvent[];
  style?: string;
}) {
  const navigate = useNavigate();

  function eventData(e: TimelineEvent): DashboardEventData {
    switch (e.type) {
      case TimelineEventType.created:
        return {
          text: `created ${
            props.type === RecentActivityType.dashboard
              ? "an inventory"
              : "this"
          } item.`,
          image: require("../assets/images/add-white.png"),
        };
      case TimelineEventType.edited:
        return {
          text: `edited  ${
            props.type === RecentActivityType.dashboard
              ? "an inventory"
              : "this"
          }  item.`,
          image: require("../assets/images/edit.png"),
        };
      case TimelineEventType.fault:
        return {
          text: "reported a fault on an item.",
          image: require("../assets/images/fault.png"),
        };
      case TimelineEventType.fix:
        return {
          text: "reported a fix on an item.",
          image: require("../assets/images/fix.png"),
        };
    }
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
        {props.events.map((e) => (
          <div
            key={e.id}
            onClick={() => {
              if (props.type === RecentActivityType.item) return;
              navigate(`inventory/${e.itemId}`);
            }}
            className={`flex flex-row items-center w-full mb-4 ${
              props.type === RecentActivityType.dashboard
                ? "cursor-pointer"
                : "cursor-default"
            }`}
          >
            <div className="h-8 w-8 bg-light_blue rounded-lg flex flex-col justify-center items-center">
              <img className="w-[14px]" src={eventData(e).image} />
            </div>
            <div className="flex flex-col ml-4 justify-center">
              <span className="text-[11px] font-medium text-light_blue mb-1">
                {moment(e.createdAt).format("DD/MM/YY, HH:mm")}
              </span>
              <span className="text-sm font-medium text-light_purple">
                {e.userName} {eventData(e).text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
