import { FilterOption } from "../components/FilterCard";

export class ArrayHelper {
  static uniqueArray(array: FilterOption[]) {
    return array.filter(
      (obj, index, self) => index === self.findIndex((t) => t.name === obj.name)
    );
  }
}
