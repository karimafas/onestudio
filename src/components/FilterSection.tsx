import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearAllFilters, FilterType } from "../features/data/filterSlice";
import { InventoryItem } from "../objects/InventoryItem";
import { FilterService } from "../services/FilterService";
import { FilterCard } from "./FilterCard";

export function FilterSection(props: { items: InventoryItem[] }) {
  const { items } = props;
  const dispatch = useAppDispatch();
  const visible = useAppSelector((state) => state.filter.visible);
  const filterState = useAppSelector((state) => state.filter);
  const locations = useAppSelector((state) => state.data.locations);
  const categories = useAppSelector((state) => state.data.categories);
  const owners = useAppSelector((state) => state.data.studioUsers);
  const statuses = useAppSelector((state) => state.data.statuses);

  const height = visible ? "h-[4em]" : "h-0";
  const border = "border-lightest_purple2 border-[2px]";
  const margin = visible ? "mt-4" : "";
  const opacity = visible ? "opacity-100" : "opacity-0";
  const itemsOpacity = visible ? "opacity-100" : "opacity-0";

  return (
    <div
      className={`transition-all duration-300 ${height} ${border} ${margin} ${opacity} rounded-lg`}
    >
      <div
        className={`w-full h-full ${itemsOpacity} transition-all duration-700 delay-200 flex flex-row items-center px-5 justify-around`}
      >
        <FilterCard
          title="Manufacturer"
          options={FilterService.getManufacturers(items)}
          selected={FilterService.getArray(
            filterState,
            FilterType.manufacturers
          )}
        />
        <FilterCard
          title="Location"
          options={FilterService.getLocations(items, locations)}
          selected={FilterService.getArray(filterState, FilterType.locations)}
        />
        <FilterCard
          title="Category"
          options={FilterService.getCategories(items, categories)}
          selected={FilterService.getArray(filterState, FilterType.categories)}
        />
        <FilterCard
          title="Owner"
          options={FilterService.getOwners(items, owners)}
          selected={FilterService.getArray(filterState, FilterType.owners)}
        />
        <FilterCard
          title="Status"
          options={FilterService.getStatuses(items, statuses)}
          selected={FilterService.getArray(filterState, FilterType.statuses)}
        />
        <span
          className="text-sm font-semibold text-dark_blue hover:underline cursor-pointer"
          onClick={() => dispatch(clearAllFilters())}
        >
          Clear all filters
        </span>
      </div>
    </div>
  );
}
