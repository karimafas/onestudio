import moment from "moment";
import { useAppDispatch } from "../app/hooks";
import { ImageHelper, Images } from "../helpers/ImageHelpers";
import { unauthorise } from "../reducers/authSlice";
import { AuthRepository } from "../repositories/AuthRepository";
import { NotificationButton } from "./NotificationButton";

export function Header() {
  const dispatch = useAppDispatch();

  async function _logout() {
    const success = await AuthRepository.logout();
    if (success) dispatch(unauthorise());
  }

  return (
    <div className="flex flex-col">
      <div className="w-full h-20 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          <img className="mr-4 w-5" src={ImageHelper.image(Images.calendar)} />
          <span className="text-base font-medium text-dark_blue">
            {moment().format("D MMMM")}
          </span>
        </div>
        <NotificationButton />
      </div>
      <div className="h-[1.5px] w-full bg-light_grey"></div>
    </div>
  );
}
