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

  public static async createCategory(name: string): Promise<boolean> {
    let success = false;

    try {
      const body = {
        name: name,
      };

      const resp = await RequestService.request(
        "category",
        RequestType.post,
        body
      );

      if (resp.status === 201) {
        success = true;
        LoggerService.log("Created category.", resp.data);
      }
    } catch (e) {
      LoggerService.log("Couldn't create category.");
    }

    return success;
  }

  public static async deleteCategory(id: number): Promise<boolean> {
    let success = false;

    try {
      const resp = await RequestService.request(
        `category/${id}`,
        RequestType.delete
      );

      if (resp.status === 200) {
        success = true;
        LoggerService.log("Deleted category.", resp.data);
      }
    } catch (e) {
      LoggerService.log("Couldn't delete category.");
    }

    return success;
  }
}
