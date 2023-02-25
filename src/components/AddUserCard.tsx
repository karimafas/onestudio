import { ImageHelper, Images } from "../helpers/ImageHelpers";

export function AddUserCard(props: { onClick: Function }) {
  return (
    <div
      onClick={() => props.onClick()}
      className="h-50 w-64 bg-white rounded-2xl drop-shadow-2xl mt-6 ml-6 hover:translate-y-[-0.5rem] transition-all duration-500 cursor-pointer flex flex-row items-center p-8"
    >
      <img className="h-6" src={ImageHelper.image(Images.users)} />
      <div className="flex flex-col ml-3">
        <span className="font-medium text-dark_blue text-lg">
          Invite a user
        </span>
        <span className="text-sm font-medium text-light_blue">
          Add a user to your OneStudio team
        </span>
      </div>
    </div>
  );
}
