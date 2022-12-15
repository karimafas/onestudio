import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { TimelineEvent, TimelineEventType } from "../objects/TimelineEvent";

interface DashboardEventData {
  text: string;
  image: any;
}

function eventData(e: TimelineEvent): DashboardEventData {
  switch (e.type) {
    case TimelineEventType.created:
      return {
        text: "created an inventory item.",
        image: require("../assets/images/add-white.png"),
      };
    case TimelineEventType.edited:
      return {
        text: "edited an inventory item.",
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

export function RecentActivity() {
  const navigate = useNavigate();
  const events = useAppSelector((state) => state.data.events);

  return (
    <div className="flex flex-col w-2/5 h-full py-8">
      <div className="w-full h-full border-dashed border-lightest_purple border-4 rounded-2xl flex flex-col p-8">
        <span className="font-bold text-xl text-dark_blue mb-6">
          Recent activity
        </span>
        {events.map((e) => (
          <div
            onClick={() => navigate(`inventory/${e.itemId}`)}
            className="flex flex-row w-full mb-4 cursor-pointer"
          >
            <div className="h-11 w-11 bg-light_blue rounded-lg flex flex-col justify-center items-center">
              <img className="w-5" src={eventData(e).image} />
            </div>
            <div className="flex flex-col ml-4 justify-center">
              <span className="text-[10px] text-light_blue mb-1">
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
