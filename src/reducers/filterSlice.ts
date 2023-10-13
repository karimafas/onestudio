import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilterOption } from "../components/FilterCard";

export enum FilterType {
  manufacturers = "manufacturers",
  locations = "locations",
  categories = "categories",
  owners = "owners",
  statuses = "statuses",
}

export interface FilterState {
  visible: boolean;
  manufacturers: FilterOption[];
  locations: FilterOption[];
  categories: FilterOption[];
  owners: FilterOption[];
  statuses: FilterOption[];
}

const initialState: FilterState = {
  visible: false,
  manufacturers: [],
  locations: [],
  categories: [],
  owners: [],
  statuses: [],
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    showFilters: (state: FilterState) => {
      state.visible = true;
    },
    hideFilters: (state: FilterState) => {
      state.visible = false;
    },
    selectOption: (state: FilterState, action: PayloadAction<FilterOption>) => {
      const option = action.payload;
      const type = option.type;
      let array;

      switch (type) {
        case FilterType.manufacturers:
          array = [...state.manufacturers];
          break;
        case FilterType.locations:
          array = [...state.locations];
          break;
        case FilterType.categories:
          array = [...state.categories];
          break;
        case FilterType.owners:
          array = [...state.owners];
          break;
        case FilterType.statuses:
          array = [...state.statuses];
          break;
      }

      const index = array.map((i) => i.id).indexOf(option.id);
      if (index > -1) {
        array.splice(index, 1);
      } else {
        array.push(option);
      }

      return {
        ...state,
        [type]: array,
      };
    },
    clearFilter: (state: FilterState, action: PayloadAction<FilterType>) => {
      const type = action.payload;
      switch (type) {
        case FilterType.manufacturers:
          state.manufacturers = [];
          break;
        case FilterType.locations:
          state.locations = [];
          break;
        case FilterType.categories:
          state.categories = [];
          break;
        case FilterType.owners:
          state.owners = [];
          break;
        case FilterType.statuses:
          state.statuses = [];
          break;
      }
    },
    clearAllFilters: (state: FilterState) => {
      return {
        ...initialState,
        visible: true,
      };
    },
  },
});

export const {
  showFilters,
  hideFilters,
  selectOption,
  clearFilter,
  clearAllFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
