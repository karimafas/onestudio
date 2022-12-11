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
  const focus = selected ? "focused" : "unfocused";
  const textColor = selected ? "text-blue1" : "text-grey";

  function getImage() {
    switch (props.tab) {
      case SidebarTabs.dashboard:
        return require(`../assets/images/dashboard-${focus}.png`);
      case SidebarTabs.inventory:
        return require(`../assets/images/inventory-${focus}.png`);
      case SidebarTabs.settings:
        return require(`../assets/images/settings-${focus}.png`);
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
