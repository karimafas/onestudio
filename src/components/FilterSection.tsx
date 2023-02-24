import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  clearAllFilters,
  FilterType,
  hideFilters,
} from "../features/data/filterSlice";
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

  const [isVisible, setIsVisible] = useState<boolean>(visible);
  const [animationVisible, setAnimationVisible] = useState<boolean>(visible);

  const height = isVisible ? "h-[3em]" : "h-0";
  const margin = isVisible ? "mt-4" : "";
  const itemsOpacity = isVisible ? "opacity-100" : "opacity-0";

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(visible);
    }, 100);

    if (visible) {
      setAnimationVisible(visible);
    } else {
      setTimeout(() => {
        setAnimationVisible(visible);
      }, 350);
    }
  }, [visible]);

  if (!animationVisible) return <></>;

  return (
    <div
      className={`transition-all duration-200 ${height} ${margin} rounded-lg bg-lightest_purple2 ${
        !visible ? "delay-50" : ""
      }`}
    >
      <div
        className={`w-full h-full ${itemsOpacity} transition-all ${
          visible ? "delay-50" : ""
        } flex flex-row items-center px-5 justify-around`}
      >
        <FilterCard
          title="Manufacturer"
          options={FilterService.getManufacturers(items)}
          selected={FilterService.getArray(
            filterState,
            FilterType.manufacturers
          )}
          index={1}
          visible={visible}
        />
        <FilterCard
          title="Location"
          options={FilterService.getLocations(items, locations)}
          selected={FilterService.getArray(filterState, FilterType.locations)}
          index={2}
          visible={visible}
        />
        <FilterCard
          title="Category"
          options={FilterService.getCategories(items, categories)}
          selected={FilterService.getArray(filterState, FilterType.categories)}
          index={3}
          visible={visible}
        />
        <FilterCard
          title="Owner"
          options={FilterService.getOwners(items, owners)}
          selected={FilterService.getArray(filterState, FilterType.owners)}
          index={4}
          visible={visible}
        />
        <FilterCard
          title="Status"
          options={FilterService.getStatuses(items, statuses)}
          selected={FilterService.getArray(filterState, FilterType.statuses)}
          index={5}
          visible={visible}
        />
        <span
          className={`text-sm font-semibold text-light_purple hover:underline cursor-pointer`}
          onClick={() => dispatch(clearAllFilters())}
        >
          Clear all filters
        </span>
      </div>
    </div>
  );
}
