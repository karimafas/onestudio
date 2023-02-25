import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { ImageHelper, Images } from "../helpers/ImageHelpers";
import { AuthRepository } from "../repositories/AuthRepository";
import { SidebarTab, SidebarTabs } from "./SidebarTab";
import { UserTag } from "./UserTag";

function getTab(location: any): SidebarTabs {
  const path = location.pathname.replace("/", "");

  if (path.startsWith("dashboard")) {
    return SidebarTabs.dashboard;
  } else if (path.startsWith("inventory")) {
    return SidebarTabs.inventory;
  } else if (path.startsWith("settings")) {
    return SidebarTabs.settings;
  }

  return SidebarTabs.dashboard;
}

export default function Sidebar() {
  const user = useAppSelector((state) => state.data.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState<SidebarTabs>(getTab(location));
  const [showLogout, setShowLogout] = useState<boolean>(false);

  useEffect(() => {
    callback(location);
  }, [location, callback]);

  function callback(location: any) {
    setTab(getTab(location));
  }

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
      className="h-screen flex flex-col overflow-hidden"
      sx={{
        width: "15em",
      }}
    >
      <div className="h-full w-full flex flex-row">
        <div className="flex flex-col justify-between">
          <div>
            <div className="px-14 mt-8">
              <img src={ImageHelper.image(Images.logoTyped)} />
            </div>
            <div className="flex-col align-center mt-8 w-full">
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
          <div
            className="h-[10em] p-6 flex flex-col justify-end"
            onMouseOver={() => {
              if (!showLogout) return;
              setShowLogout(true);
            }}
            onMouseLeave={() => setShowLogout(false)}
          >
            <div
              className="w-[3em] h-[3em] cursor-pointer"
              onMouseOver={() => setShowLogout(true)}
              onMouseLeave={() => setShowLogout(false)}
            >
              <UserTag user={user} />
            </div>
            <div className="relative w-[9em] h-[3.2em] mt-[-3.1em] ml-[2em] rounded-lg p-2 flex flex-row justify-end pointer-events-none">
              {showLogout ? (
                <div
                  className="h-full w-[80%] bg-white shadow rounded-lg flex flex-row items-center justify-center pointer-events-auto cursor-pointer"
                  onClick={async () => {
                    await AuthRepository.logout();
                    window.location.reload();
                  }}
                >
                  <span className="text-sm font-semibold text-red">Logout</span>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className="w-1 h-full bg-light_grey"></div>
      </div>
    </Box>
  );
}
