import {
  CsvItemDfo,
  CsvItemDto,
  InventoryItem,
  ItemDfo,
  ItemDto,
} from "../objects/InventoryItem";
import { LoggerService } from "../services/LoggerService";
import { RequestService, RequestType } from "../services/RequestService";

export class ItemRepository {
  public static async getInventoryItems(): Promise<InventoryItem[]> {
    let items: InventoryItem[] = [];

    try {
      const resp = await RequestService.request("item", RequestType.get);

      LoggerService.log("Loaded inventory items from API.", resp);

      const _items = resp.data;

      if (_items) {
        for (const item of _items) {
          items.push(InventoryItem.fromJson(item));
        }
      }
    } catch (e) {
      LoggerService.log(`Couldn't load items.`);
    }

    return items;
  }

  public static async getInventoryItem(
    id: number
  ): Promise<InventoryItem | undefined> {
    let item;

    try {
      const resp = await RequestService.request(`item/${id}`, RequestType.get);

      LoggerService.log(`Loaded inventory item with id ${id} from API.`, resp);
      if (resp.data) {
        try {
          item = InventoryItem.fromJson(resp.data);
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      LoggerService.log("Couldn't load items.");
    }

    return item;
  }

  public static async createItem(
    i: ItemDfo
  ): Promise<{ success: boolean; item: InventoryItem | undefined }> {
    let item;
    let success: boolean = false;

    try {
      const dto = InventoryItem.fromDfo(i);

      LoggerService.log(`adding item with body`, dto);

      const resp = await RequestService.request("item", RequestType.post, dto);

      if (resp.status === 201) {
        success = true;
      }

      item = InventoryItem.fromJson(resp.data);

      LoggerService.log("Added new item.", success);
    } catch (e: any) {
      LoggerService.log(e.toString());
    }

    return { success: success, item: item };
  }

  public static async createItemsList(items: CsvItemDfo[]): Promise<boolean> {
    let success: boolean = false;

    try {
      const dtos = [];

      for (const item of items) {
        const dto = InventoryItem.fromCsvDfo(item);
        dtos.push(dto);
      }

      LoggerService.log(`adding item with body`, dtos);

      const resp = await RequestService.request(
        "item/createItemsFromList",
        RequestType.post,
        dtos
      );

      if (resp.status === 201) {
        success = true;
      }

      LoggerService.log("Added new lot of items.", success);
    } catch (e: any) {
      LoggerService.log(e.toString());
    }

    return success;
  }

  public static async updateItem(
    i: ItemDfo
  ): Promise<{ success: boolean; item: InventoryItem | undefined }> {
    let success: boolean = false;
    let updatedItem: InventoryItem | undefined;
    try {
      const item: ItemDto = InventoryItem.fromDfo(i);

      const resp = await RequestService.request(
        `item/${i.id}`,
        RequestType.put,
        item
      );

      if (resp.status === 200) {
        success = true;
        updatedItem = InventoryItem.fromJson(resp.data);
        LoggerService.log("Updated item.", resp.data);
      }
    } catch (e) {
      LoggerService.log("Couldn't update item.", e);
    }

    return { success, item: updatedItem };
  }

  public static async duplicateItem(
    id: number
  ): Promise<{ item: InventoryItem | undefined; success: boolean }> {
    let success: boolean = false;
    let item: InventoryItem | undefined;

    try {
      const resp = await RequestService.request(
        `item/duplicate/${id}`,
        RequestType.post
      );

      if (resp.status === 201) {
        success = true;

        item = InventoryItem.fromJson(resp.data);

        LoggerService.log("Duplicated item.", resp.data);
      }
    } catch (e) {
      LoggerService.log("Couldn't duplicate item.", e);
    }

    return { item: item, success: success };
  }

  public static async deleteItems(ids: number[]): Promise<boolean> {
    let success: boolean = false;
    try {
      const body = {
        ids: ids,
      };

      const resp = await RequestService.request(
        "item/removeMany",
        RequestType.post,
        body
      );

      if (resp.status === 201) {
        success = true;
        LoggerService.log("Deleted item(s).", resp.data);
      }
    } catch (e) {
      LoggerService.log(`Couldn't delete item(s).`);
    }

    return success;
  }
}
