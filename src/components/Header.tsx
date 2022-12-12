import moment from "moment";
import { useAppSelector } from "../app/hooks";

export function Header() {
  const user = useAppSelector((state) => state.data.user);

  const initials = `${user?.firstName?.substring(0, 1) ?? ""}${
    user?.lastName?.substring(0, 1) ?? ""
  }`.toUpperCase();

  return (
    <>
      <div className="w-full h-20 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          <img
            className="mr-4 w-5"
            src={require("../assets/images/calendar.png")}
          />
          <span className="text-base font-medium text-dark_blue">
            {moment().format('D MMMM')}
          </span>
        </div>
        <div className="h-12 w-12 rounded-full bg-blue cursor-pointer flex flex-row items-center justify-center">
          <span className="text-lg text-white font-medium">{initials}</span>
        </div>
      </div>
      <div className="h-[1.5px] w-full bg-light_grey"></div>
    </>
  );
}
