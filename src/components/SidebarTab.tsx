import { ImageHelper, Images } from "../helpers/ImageHelpers";

export enum SidebarTabs {
  dashboard = "Dashboard",
  inventory = "Inventory",
  settings = "Settings",
}

export function SidebarTab(props: {
  tab: SidebarTabs;
  onClick: Function;
  selectedTab: SidebarTabs;
}) {
  const selected = props.selectedTab === props.tab;
  const textColor = selected ? "text-blue" : "text-grey";

  function getImage() {
    switch (props.tab) {
      case SidebarTabs.dashboard:
        return ImageHelper.image(
          selected ? Images.dashboardFocused : Images.dashboardUnfocused
        );
      case SidebarTabs.inventory:
        return ImageHelper.image(
          selected ? Images.inventoryFocused : Images.inventoryUnfocused
        );
      case SidebarTabs.settings:
        return ImageHelper.image(
          selected ? Images.settingsFocused : Images.settingsUnfocused
        );
    }
  }

  const image = getImage();

  return (
    <div
      className="h-12 ml-10 cursor-pointer flex flex-row items-center"
      onClick={() => props.onClick(props.tab)}
    >
      <div className="w-9">
        <img className="h-4 mr-3" src={image} />
      </div>
      <span className={`text-base font-medium ${textColor} transition-all`}>
        {props.tab}
      </span>
    </div>
  );
}
