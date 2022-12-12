import * as React from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { SidebarTab, SidebarTabs } from "./SidebarTab";

export default function Sidebar() {
  const [tab, setTab] = React.useState<SidebarTabs>(SidebarTabs.dashboard);
  const navigate = useNavigate();

  const handleChange = (tab: SidebarTabs) => {
    setTab(tab);

    switch (tab) {
      case SidebarTabs.dashboard:
        navigate("/");
        break;
      case SidebarTabs.inventory:
        navigate("/inventory");
        break;
      case SidebarTabs.settings:
        navigate("/settings");
        break;
    }
  };

  function getMarginTop(): string {
    switch (tab) {
      case SidebarTabs.dashboard:
        return "mt-[-9rem]";
      case SidebarTabs.inventory:
        return "mt-[-6rem]";
      case SidebarTabs.settings:
        return "mt-[-3rem]";
    }
  }

  return (
    <Box
      className="flex h-screen flex flex-col"
      sx={{
        width: "15em",
      }}
    >
      <div className="h-full w-full flex flex-row">
        <div>
          <div className="px-14 pt-8">
            <img src={require("../assets/images/logo_typed.png")} />
          </div>
          <div className="flex-col align-center pt-8 w-full">
            <SidebarTab
              onClick={handleChange}
              tab={SidebarTabs.dashboard}
              selectedTab={tab}
            />
            <SidebarTab
              onClick={handleChange}
              tab={SidebarTabs.inventory}
              selectedTab={tab}
            />
            <SidebarTab
              onClick={handleChange}
              tab={SidebarTabs.settings}
              selectedTab={tab}
            />
            <div
              className={`flex flex-row items-center h-12 mb-3 z-[-100] ${getMarginTop()} relative cursor-pointer transition-all duration-300 pr-5`}
            >
              <div className="w-2 h-10 bg-blue mr-3 rounded-tr rounded-br"></div>
              <div className="bg-white rounded drop-shadow-xl h-full w-full"></div>
            </div>
          </div>
        </div>
        <div className="w-1 h-full bg-light_grey"></div>
      </div>
    </Box>
  );
}
