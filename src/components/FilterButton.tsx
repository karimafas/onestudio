import { useAppDispatch, useAppSelector } from "../app/hooks";
import { hideFilters, showFilters } from "../features/data/filterSlice";
import { ImageHelper, Images } from "../helpers/ImageHelper";

export function FilterButton() {
  const dispatch = useAppDispatch();
  const filtering = useAppSelector((state) => state.filter.visible);
  const background = filtering ? "bg-light_blue" : "bg-lightest_purple";
  const image = filtering ? Images.filterLight : Images.filterDark;

  return (
    <div
      className={`h-10 w-10 rounded-lg ${background} ml-3 flex flex-col items-center justify-center transition-all cursor-pointer`}
      onClick={() =>
        filtering ? dispatch(hideFilters()) : dispatch(showFilters())
      }
    >
      <img width="40%" src={ImageHelper.image(image)} />
    </div>
  );
}
