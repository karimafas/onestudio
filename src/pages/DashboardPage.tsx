import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { DashboardButton } from "../components/DashboardButton";
import { Header } from "../components/Header";
import { InventoryInfoCard } from "../components/InventoryInfoCard";
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
        <div className="flex flex-col w-2/3 justify">
          <span className="text-2xl font-bold mt-8 ml-2 text-dark_blue">
            {DateHelper.getGreeting()}, {user?.firstName ?? ""}!
          </span>
          <div className="flex flex-row">
            <StudioInfoCard />
            <InventoryInfoCard />
          </div>

          <DashboardButton
            text="Add an inventory item"
            onClick={() => navigate("inventory")}
            image={require("../assets/images/add-circle.png")}
          />
          <DashboardButton
            text="Add a user to the team"
            onClick={() => navigate("settings")}
            image={require("../assets/images/person.png")}
          />
          <DashboardButton
            text="View your profile info"
            onClick={() => navigate("inventory")}
            image={require("../assets/images/info-purple.png")}
          />
          <DashboardButton
            text="Go to studio settings"
            onClick={() => navigate("settings")}
            image={require("../assets/images/settings.png")}
          />
        </div>
        <div className="flex flex-col w-1/3 h-full p-8">
          <div className="w-full h-full border-dashed border-lightest_purple border-4 rounded-2xl flex flex-col p-8">
            <span className="font-bold text-xl text-dark_blue">Recent activity</span>
          </div>
        </div>
      </div>
    </div>
  );
}
