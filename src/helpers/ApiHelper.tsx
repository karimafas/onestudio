import { InventoryItem } from "../objects/InventoryItem";
import { TimelineEvent, TimelineEventType } from "../objects/TimelineEvent";
import { Logger } from "../services/logger";

const axios = require("axios");
const url = "http://localhost:9999/api/";

function eventToString(type: TimelineEventType) {
  switch (type) {
    case TimelineEventType.created:
      return "create";
    case TimelineEventType.edited:
      return "edit";
    case TimelineEventType.fault:
      return "fault";
  }
}

export class ApiHelper {
  public static async getInventoryItems(): Promise<Array<InventoryItem>> {
    let items: Array<InventoryItem> = [];

    try {
      const resp = await axios.get(url + `/items`);

      Logger.log("Loaded inventory items from API.", resp);

      const _items = resp.data;

      if (_items) {
        for (const item of _items) {
          items.push(InventoryItem.fromJson(item));
        }
      }
    } catch (e) {
      Logger.log(`Couldn't load items.`);
    }

    return items;
  }

  public static async getInventoryItem(
    id: number
  ): Promise<InventoryItem | undefined> {
    let item;

    try {
      const resp = await axios.get(url + `/items/${id}`);

      Logger.log(`Loaded inventory item with id ${id} from API.`, resp);

      if (resp.data) {
        item = InventoryItem.fromJson(resp.data[0]);
      }
    } catch (e) {
      Logger.log(`Couldn't load items.`);
    }

    return item;
  }

  public static async createItem(
    i: InventoryItem
  ): Promise<{ success: boolean; id: any }> {
    let id;
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

      id = parseInt(resp.data.id);

      Logger.log("Added new item.", success);
    } catch (e: any) {
      Logger.log(e.toString());
    }

    return { success: success, id: id };
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

  public static async deleteItems(ids: Array<number>): Promise<boolean> {
    let success: boolean = false;
    try {
      const params = `?ids=${ids.join(",")}`;
      const resp = await axios.delete(url + `items${params}`);

      if (resp.status === 200) {
        success = true;
        Logger.log("Deleted item(s).", resp.data);
      }
    } catch (e) {
      Logger.log(`Couldn't delete item(s).`);
    }

    return success;
  }

  public static async getItemEvents(
    itemId: number
  ): Promise<Array<TimelineEvent>> {
    let events: Array<TimelineEvent> = [];

    try {
      const resp = await axios.get(url + `/events/${itemId}`);

      const _events = resp.data;

      if (_events) {
        for (const event of _events) {
          events.push(TimelineEvent.fromJson(event));
        }
      }
    } catch (e) {
      Logger.log(`Couldn't load items.`);
    }

    return events;
  }

  public static async createEvent(
    itemId: number,
    notes: string,
    eventType: TimelineEventType
  ): Promise<boolean> {
    let success = false;

    try {
      const body = {
        item_id: itemId,
        notes: notes,
        type: eventToString(eventType),
      };

      const resp = await axios.post(url + `events`, body);

      if (resp.status === 200) {
        success = true;
        Logger.log("Created event.", resp.data);
      }
    } catch (e) {
      Logger.log(`Couldn't create event.`);
    }

    return success;
  }
}
