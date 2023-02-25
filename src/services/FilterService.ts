import { FilterOption } from "../components/FilterCard";
import { ArrayHelper } from "../helpers/ArrayHelpers";
import { Category } from "../objects/Category";
import { InventoryItem } from "../objects/InventoryItem";
import { Status } from "../objects/Status";
import { StudioLocation } from "../objects/StudioLocation";
import { StudioUser } from "../objects/StudioUser";
import { FilterState, FilterType } from "../reducers/filterSlice";

export class FilterService {
  static filter(filterState: FilterState, items: InventoryItem[]) {
    if (filterState.manufacturers.length > 0) {
      items = items.filter((i) =>
        filterState.manufacturers.map((m) => m.name).includes(i.manufacturer)
      );
    }
    if (filterState.locations.length > 0) {
      items = items.filter((i) =>
        filterState.locations.map((l) => l.id).includes(i.locationId)
      );
    }
    if (filterState.categories.length > 0) {
      items = items.filter((i) =>
        filterState.categories.map((c) => c.id).includes(i.categoryId)
      );
    }
    if (filterState.owners.length > 0) {
      items = items.filter((i) =>
        filterState.owners.map((o) => o.id).includes(i.ownerId)
      );
    }
    if (filterState.statuses.length > 0) {
      items = items.filter((i) =>
        filterState.statuses.map((s) => s.id).includes(i.status.id)
      );
    }

    return items;
  }

  static getArray(filterState: FilterState, type: FilterType) {
    switch (type) {
      case FilterType.manufacturers:
        return filterState.manufacturers;
      case FilterType.locations:
        return filterState.locations;
      case FilterType.categories:
        return filterState.categories;
      case FilterType.owners:
        return filterState.owners;
      case FilterType.statuses:
        return filterState.statuses;
    }
  }

  static getManufacturers(items: InventoryItem[]) {
    const manufacturers = items.map((i) => i.manufacturer);
    const options: FilterOption[] = [];
    manufacturers.map((m, index) =>
      options.push({ id: index, name: m, type: FilterType.manufacturers })
    );
    return ArrayHelper.uniqueArray(options);
  }

  static getLocations(items: InventoryItem[], allLocations: StudioLocation[]) {
    const locations = items.map((i) => i.locationId);
    const options: FilterOption[] = [];
    locations.map((l) =>
      options.push({
        id: l,
        name: allLocations.filter((loc) => loc.id === l)[0].name,
        type: FilterType.locations,
      })
    );
    return ArrayHelper.uniqueArray(options);
  }

  static getCategories(items: InventoryItem[], allCategories: Category[]) {
    const categories = items.map((i) => i.categoryId);
    const options: FilterOption[] = [];
    categories.map((c) =>
      options.push({
        id: c,
        name: allCategories.filter((cat) => cat.id === c)[0].name,
        type: FilterType.categories,
      })
    );
    return ArrayHelper.uniqueArray(options);
  }

  static getOwners(items: InventoryItem[], allOwners: StudioUser[]) {
    const owners = items.map((i) => i.ownerId);
    const options: FilterOption[] = [];
    owners.map((o) =>
      options.push({
        id: o,
        name: allOwners.filter((own) => own.id === o)[0].fullName,
        type: FilterType.owners,
      })
    );
    return ArrayHelper.uniqueArray(options);
  }

  static getStatuses(items: InventoryItem[], allStatuses: Status[]) {
    const statuses = items.map((i) => i.status.id);
    const options: FilterOption[] = [];
    statuses.map((s) =>
      options.push({
        id: s,
        name: allStatuses.filter((st) => st.id === s)[0].displayName,
        type: FilterType.statuses,
      })
    );
    return ArrayHelper.uniqueArray(options);
  }
}
