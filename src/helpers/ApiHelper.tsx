import { InventoryItem } from "../objects/InventoryItem";
import { Logger } from "../services/logger";

const axios = require("axios");
const url = "http://localhost:9999/api/";

export class ApiHelper {
  public static async getInventoryItems(): Promise<Array<{}>> {
    let items = [];

    try {
      const resp = await axios.get(url + `/items`);

      Logger.log("Loaded inventory items from API.");

      items = resp.data;
    } catch (e) {
      Logger.log(`Couldn't load items.`);
    }

    return items;
  }

  public static async createItem(i: InventoryItem): Promise<boolean> {
    let success: boolean = false;

    try {
      const resp = await axios.post(url + "items", {
        m_number: i.mNumber,
        manufacturer: i.manufacturer,
        model: i.model,
        notes: i.notes || "",
        serial: i.serial,
        location_id: i.locationId,
        category_id: i.categoryId,
        owner_id: i.ownerId,
        price: i.price,
      });

      if (resp.status === 200) {
        success = true;
      }

      Logger.log("Added new item.", success);
    } catch (e: any) {
      Logger.log(e.toString());
    }

    return success;
  }

  public static async updateItem(i: InventoryItem): Promise<boolean> {
    let success: boolean = false;
    try {
      const body = {
        m_number: i.mNumber,
        manufacturer: i.manufacturer,
        model: i.model,
        notes: i.notes,
        serial: i.serial,
        location_id: i.locationId,
        category_id: i.categoryId,
        owner_id: i.ownerId,
        price: i.price,
      };

      const resp = await axios.put(url + `items/${i.id}`, body);

      if (resp.status === 200) {
        success = true;
        Logger.log("Updated item.", resp.data);
      }
    } catch (e) {
      Logger.log(`Couldn't update item.`);
    }

    return success;
  }

  public static async deleteItem(id: number): Promise<boolean> {
    let success: boolean = false;
    try {
      const resp = await axios.delete(url + `items/${id}`);

      if (resp.status === 200) {
        success = true;
        Logger.log("Deleted item.", resp.data);
      }
    } catch (e) {
      Logger.log(`Couldn't delete item.`);
    }

    return success;
  }
}
