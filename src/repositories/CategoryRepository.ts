import { Category } from "../objects/Category";
import { LoggerService } from "../services/LoggerService";
import { RequestService, RequestType } from "../services/RequestService";

export class CategoryRepository {
  public static async getCategories(): Promise<Category[]> {
    let categories: Category[] = [];

    try {
      const resp = await RequestService.request("category", RequestType.get);

      LoggerService.log("Loaded categories from API.", resp);

      const _categories = resp.data;

      if (_categories) {
        for (const category of _categories) {
          categories.push(Category.fromJson(category));
        }
      }
    } catch (e) {
      LoggerService.log("Couldn't load categories.");
    }

    return categories;
  }
}
