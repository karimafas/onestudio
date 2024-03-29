import { useWindowSize } from "@react-hook/window-size";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { Header } from "../../components/Header";
import { InventoryInfoCard } from "../../components/InventoryInfoCard";
import { StudioInfoCard } from "../../components/StudioInfoCard";
import { DateHelper } from "../../helpers/DateHelpers";
import { ImageHelper, Images } from "../../helpers/ImageHelpers";
import {
  DashboardButton,
  DashboardButtonType,
} from "./components/DashboardButton";
import {
  RecentActivity,
  RecentActivityType,
} from "./components/RecentActivity";

export function DashboardPage() {
  const user = useAppSelector((state) => state.data.user);
  const activity = useAppSelector((state) => state.data.activity);
  const navigate = useNavigate();
  const [width, height] = useWindowSize();

  return (
    <div className="py-3 px-10 w-full h-[85vh]">
      <Header />
      <div className="flex flex-row justify-between w-full h-full animate-fade">
        <div className="flex flex-col w-3/5">
          <span className="text-2xl font-bold mt-8 ml-2 text-dark_blue">
            {DateHelper.getGreeting()}, {user?.firstName ?? ""}!
          </span>
          <div className="flex flex-row h-60 items-center mt-4">
            {width > 1330 ? <StudioInfoCard collapsed={false} /> : <></>}
            <InventoryInfoCard />
          </div>
          <div className="flex flex-col mt-6">
            <DashboardButton
              key="create-item"
              type={DashboardButtonType.inventory}
              onClick={() => navigate("inventory?createItem=true")}
              image={ImageHelper.image(Images.addCircle)}
            />
            <DashboardButton
              key="invite-user"
              type={DashboardButtonType.addUser}
              onClick={() => navigate("settings?inviteUser=true")}
              image={ImageHelper.image(Images.person)}
            />
            <DashboardButton
              key="settings"
              type={DashboardButtonType.studioSettings}
              onClick={() => navigate("settings")}
              image={ImageHelper.image(Images.settings)}
            />
          </div>
        </div>
        <div className="w-2/5">
          <RecentActivity
            type={RecentActivityType.dashboard}
            activity={activity}
          />
        </div>
      </div>
    </div>
  );
}
