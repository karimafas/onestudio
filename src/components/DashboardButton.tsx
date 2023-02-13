import { useNavigate } from "react-router-dom";

export enum DashboardButtonType {
  inventory = "Add an inventory item",
  addUser = "Add a user to the team",
  viewProfile = "View studio profile",
  studioSettings = "Go to studio settings",
}

export function DashboardButton(props: {
  type: DashboardButtonType;
  image: any;
  onClick: Function;
}) {
  return (
    <div
      className="h-12 cursor-pointer w-1/2 mb-4"
      onClick={() => {
        debugger
        props.onClick();
      }}
    >
      <div className="flex flex-col w-full cursor-pointer">
        <div className="flex flex-row justify-between items-center px-6 h-12 bg-white shadow-xl rounded-xl text-light_purple font-medium">
          <span>{props.type}</span>
          <img className="w-5" src={props.image} />
        </div>
      </div>
    </div>
  );
}
