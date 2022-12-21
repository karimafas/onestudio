import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import {
  DashboardButton,
  DashboardButtonType,
} from "../components/DashboardButton";
import { Header } from "../components/Header";
import { InventoryInfoCard } from "../components/InventoryInfoCard";
import {
  RecentActivity,
  RecentActivityType,
} from "../components/RecentActivity";
import { StudioInfoCard } from "../components/StudioInfoCard";
import { DateHelper } from "../helpers/DateHelper";
import { ImageHelper, Images } from "../helpers/ImageHelper";

export function DashboardPage() {
  const user = useAppSelector((state) => state.data.user);
  const events = useAppSelector((state) => state.data.events);
  const navigate = useNavigate();

  return (
    <div className="py-3 px-10 w-full h-[85vh]">
      <Header />
      <div className="flex flex-row justify-between w-full h-full animate-fade">
        <div className="flex flex-col w-3/5 justify">
          <span className="text-2xl font-bold mt-8 ml-2 text-dark_blue">
            {DateHelper.getGreeting()}, {user?.firstName ?? ""}!
          </span>
          <div className="flex flex-row">
            <StudioInfoCard collapsed={false} />
            <InventoryInfoCard />
          </div>
          <DashboardButton
            type={DashboardButtonType.inventory}
            onClick={() => navigate("inventory")}
            image={ImageHelper.image(Images.addCircle)}
          />
          <DashboardButton
            type={DashboardButtonType.addUser}
            onClick={() => navigate("inventory")}
            image={ImageHelper.image(Images.person)}
          />
          <DashboardButton
            type={DashboardButtonType.viewProfile}
            onClick={() => navigate("inventory")}
            image={ImageHelper.image(Images.infoPurple)}
          />
          <DashboardButton
            type={DashboardButtonType.studioSettings}
            onClick={() => navigate("settings")}
            image={ImageHelper.image(Images.settings)}
          />
        </div>
        <div>
          <RecentActivity type={RecentActivityType.dashboard} events={events} />
        </div>
      </div>
    </div>
  );
}
