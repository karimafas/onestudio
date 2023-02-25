import { useAppSelector } from "../app/hooks";
import { ImageHelper, Images } from "../helpers/ImageHelpers";

export function StudioInfoCard(props: { collapsed: boolean }) {
  const users = useAppSelector((state) => state.data.studioUsers);
  const studio = useAppSelector((state) => state.data.studio);
  const categories = useAppSelector((state) => state.data.categories);
  const locations = useAppSelector((state) => state.data.locations);

  return (
    <div
      className={`h-50 w-64 bg-white drop-shadow-2xl rounded-2xl flex flex-col p-8 justify-center cursor-pointer hover:translate-y-[-0.5rem] transition-all duration-500 ${
        props.collapsed ? "mt-6" : ""
      }`}
    >
      <div className="flex flex-row items-between">
        <div className="border-dashed border-medium_blue border-2 h-12 w-12 rounded-xl flex flex-row items-center justify-center">
          <img src={ImageHelper.image(Images.info)} className="p-[10px]" />
        </div>
        <div className="flex flex-col justify-center ml-3">
          <span className="text-dark_blue font-semibold text-lg">
            {studio?.name ?? ""}
          </span>
          {/* <span className="text-light_blue font-medium text-sm">
            London, UK
          </span> */}
        </div>
      </div>
      {props.collapsed ? (
        <></>
      ) : (
        <div className="flex flex-col mt-4 text-sm">
          <span className="text-light_purple">
            <span className="font-semibold">{users.length}</span> studio users
          </span>
          <span className="text-light_purple">
            <span className="font-semibold">{categories.length}</span>{" "}
            categories
          </span>
          <span className="text-light_purple">
            <span className="font-semibold">{locations.length}</span> locations
          </span>
        </div>
      )}
    </div>
  );
}
