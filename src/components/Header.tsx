import moment from "moment";
import { useAppSelector } from "../app/hooks";
import { AuthRepository } from "../repositories/AuthRepository";

function _logout() {
  AuthRepository.logout().then((_) => window.location.reload());
}

export function Header() {
  const user = useAppSelector((state) => state.data.user);

  const initials = `${user?.firstName?.substring(0, 1) ?? ""}${
    user?.lastName?.substring(0, 1) ?? ""
  }`.toUpperCase();

  return (
    <div className="flex flex-col">
      <div className="w-full h-20 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          <img
            className="mr-4 w-5"
            src={require("../assets/images/calendar.png")}
          />
          <span className="text-base font-medium text-dark_blue">
            {moment().format("D MMMM")}
          </span>
        </div>
        <div className="group h-12 w-12 rounded-full bg-blue cursor-pointer flex flex-row items-center justify-center">
          <span className="text-lg text-white font-medium">{initials}</span>
          <div className="h-[9rem] w-28 flex flex-col justify-end absolute mr-10">
            <div
              onClick={() => _logout()}
              className={`w-full h-9 bg-white shadow-xl rounded-lg flex flex-row justify-between items-center px-4 cursor-pointer absolute mt-28 mr-12 group-hover:opacity-100 group-hover:translate-x-0 opacity-0 translate-x-10 transition-all`}
            >
              <img className="h-4" src={require("../assets/images/exit.png")} />
              <span className="text-red font-semibold text-sm">Log out</span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[1.5px] w-full bg-light_grey"></div>
    </div>
  );
}
