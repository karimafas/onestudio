import { InventoryItem, ItemDfo, ItemUpdateDto } from "../objects/InventoryItem";
import { LoggerService } from "../services/LoggerService";
import { RequestService, RequestType } from "../services/RequestService";

export class ItemRepository {
  public static async getInventoryItems(): Promise<Array<InventoryItem>> {
    let items: Array<InventoryItem> = [];

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
    i: InventoryItem
  ): Promise<{ success: boolean; id: any }> {
    let id;
    let success: boolean = false;

    try {
      const body = {
        m_number: i.mNumber,
        manufacturer: i.manufacturer,
        model: i.model,
        notes: i.notes || "",
        serial: i.serial,
        location_id: i.locationId,
        category_id: i.categoryId,
        owner_id: i.ownerId,
        price: i.price,
      };

      LoggerService.log(`adding item with body`, body);

      const resp = await RequestService.request("item", RequestType.post, body);

      if (resp.status === 201) {
        success = true;
      }

      id = parseInt(resp.data.id);

      LoggerService.log("Added new item.", success);
    } catch (e: any) {
      LoggerService.log(e.toString());
    }

    return { success: success, id: id };
  }

  public static async updateItem(i: ItemDfo): Promise<boolean> {
    let success: boolean = false;
    try {
      const item: ItemUpdateDto = InventoryItem.fromDfo(i);

      const resp = await RequestService.request(
        `item/${i.id}`,
        RequestType.put,
        item
      );

      if (resp.status === 200) {
        success = true;
        LoggerService.log("Updated item.", resp.data);
      }
    } catch (e) {
      LoggerService.log("Couldn't update item.", e);
    }

    return success;
  }

  public static async deleteItems(ids: Array<number>): Promise<boolean> {
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
