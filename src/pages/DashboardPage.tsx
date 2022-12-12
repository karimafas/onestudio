import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import {
  DashboardButton,
  DashboardButtonType,
} from "../components/DashboardButton";
import { Header } from "../components/Header";
import { InventoryInfoCard } from "../components/InventoryInfoCard";
import { RecentActivity } from "../components/RecentActivity";
import { StudioInfoCard } from "../components/StudioInfoCard";
import { DateHelper } from "../helpers/DateHelper";
import "./DashboardPage.css";

export function DashboardPage() {
  const user = useAppSelector((state) => state.data.user);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col py-3 px-10 w-full h-full">
      <Header />
      <div className="flex flex-row w-full h-full">
        <div className="flex flex-col w-3/5 justify">
          <span className="text-2xl font-bold mt-8 ml-2 text-dark_blue">
            {DateHelper.getGreeting()}, {user?.firstName ?? ""}!
          </span>
          <div className="flex flex-row">
            <StudioInfoCard />
            <InventoryInfoCard />
          </div>
          <DashboardButton
            type={DashboardButtonType.inventory}
            onClick={() => navigate("inventory")}
            image={require("../assets/images/add-circle.png")}
          />
          <DashboardButton
            type={DashboardButtonType.addUser}
            onClick={() => navigate("inventory")}
            image={require("../assets/images/person.png")}
          />
          <DashboardButton
            type={DashboardButtonType.viewProfile}
            onClick={() => navigate("inventory")}
            image={require("../assets/images/info-purple.png")}
          />
          <DashboardButton
            type={DashboardButtonType.studioSettings}
            onClick={() => navigate("settings")}
            image={require("../assets/images/settings.png")}
          />
        </div>
        <RecentActivity />
      </div>
    </div>
  );
}
