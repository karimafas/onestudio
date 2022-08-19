import { TypesDrawerType } from "../components/TypesDrawer";
import { Category } from "../objects/Category";
import { InventoryItem } from "../objects/InventoryItem";
import { Owner } from "../objects/Owner";
import { StudioLocation } from "../objects/StudioLocation";
import { TimelineEvent, TimelineEventType } from "../objects/TimelineEvent";
import { TimelineUser } from "../objects/TimelineUser";
import { Logger } from "../services/logger";
import { HttpHelper, RequestType } from "./HttpHelper";

const url = "/api/";

function eventToString(type: TimelineEventType) {
  switch (type) {
    case TimelineEventType.created:
      return "create";
    case TimelineEventType.edited:
      return "edit";
    case TimelineEventType.fault:
      return "fault";
    case TimelineEventType.fix:
      return "fix";
  }
}

export class ApiHelper {
  public static async getInventoryItems(): Promise<Array<InventoryItem>> {
    let items: Array<InventoryItem> = [];

    try {
      const resp = await HttpHelper.request(url + `/items`, RequestType.get);

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

  public static async getLocations(): Promise<Array<StudioLocation>> {
    let locations: Array<StudioLocation> = [];

    try {
      const resp = await HttpHelper.request(
        url + `/locations`,
        RequestType.get
      );

      Logger.log("Loaded locations from API.", resp);

      const _locations = resp.data;

      if (_locations) {
        for (const location of _locations) {
          locations.push(StudioLocation.fromJson(location));
        }
      }
    } catch (e) {
      Logger.log(`Couldn't load locations.`);
    }

    return locations;
  }

  public static async getCategories(): Promise<Array<Category>> {
    let categories: Array<Category> = [];

    try {
      const resp = await HttpHelper.request(
        url + `/categories`,
        RequestType.get
      );

      Logger.log("Loaded categories from API.", resp);

      const _categories = resp.data;

      if (_categories) {
        for (const category of _categories) {
          categories.push(Category.fromJson(category));
        }
      }
    } catch (e) {
      Logger.log(`Couldn't load categories.`);
    }

    return categories;
  }

  public static async getOwners(): Promise<Array<Owner>> {
    let owners: Array<Owner> = [];

    try {
      const resp = await HttpHelper.request(url + `/owners`, RequestType.get);

      Logger.log("Loaded owners from API.", resp);

      const _owners = resp.data;

      if (_owners) {
        for (const owner of _owners) {
          owners.push(Owner.fromJson(owner));
        }
      }
    } catch (e) {
      Logger.log(`Couldn't load owners.`);
    }

    return owners;
  }

  public static async getInventoryItem(
    id: number
  ): Promise<InventoryItem | undefined> {
    let item;

    try {
      const resp = await HttpHelper.request(
        url + `/items/${id}`,
        RequestType.get
      );

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

      Logger.log(`adding item with body`, body);

      const resp = await HttpHelper.request(
        url + "items",
        RequestType.post,
        body
      );

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

      const resp = await HttpHelper.request(
        url + `items/${i.id}`,
        RequestType.put,
        body
      );

      if (resp.status === 200) {
        success = true;
        Logger.log("Updated item.", resp.data);
      }
    } catch (e) {
      Logger.log(`Couldn't update item.`, e);
    }

    return success;
  }

  public static async deleteItems(ids: Array<number>): Promise<boolean> {
    let success: boolean = false;
    try {
      const params = `?ids=${ids.join(",")}`;

      const resp = await HttpHelper.request(
        url + `items${params}`,
        RequestType.delete
      );

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
      const resp = await HttpHelper.request(
        url + `/events/${itemId}`,
        RequestType.get
      );

      const _events = resp.data;

      if (_events) {
        for (const event of _events) {
          const e = TimelineEvent.fromJson(event);
          await e.initialise();
          events.push(e);
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

      const resp = await HttpHelper.request(
        url + `events`,
        RequestType.post,
        body
      );

      if (resp.status === 200) {
        success = true;
        Logger.log("Created event.", resp.data);
      }
    } catch (e) {
      Logger.log(`Couldn't create event.`);
    }

    return success;
  }

  public static async login(email: string, password: string): Promise<boolean> {
    let success: boolean = false;

    try {
      const body = {
        email: email,
        password: password,
      };

      const resp = await HttpHelper.request(
        url + `login`,
        RequestType.post,
        body,
        false
      );

      if (resp.status === 200) {
        success = true;
        Logger.log("Logged in user.", resp.data);
      }
    } catch (e) {
      Logger.log(`Couldn't login user.`);
    }

    return success;
  }

  public static async logout(): Promise<boolean> {
    let success: boolean = false;

    try {
      const resp = await HttpHelper.request(url + `logout`, RequestType.post);

      if (resp.status === 200) {
        success = true;
        Logger.log("Logged out.", resp.data);
        window.location.reload();
      }
    } catch (e) {
      Logger.log(`Couldn't log out user.`);
    }

    return success;
  }

  public static async checkToken(): Promise<boolean> {
    let success: boolean = false;

    try {
      const resp = await HttpHelper.request(
        url + `jwt-token-chk`,
        RequestType.get,
        undefined,
        false
      );

      if (resp.status === 200) {
        success = true;
        Logger.log("Found valid token.", resp.data);
      }
    } catch (e) {
      Logger.log(`Couldn't find valid token.`);
    }

    return success;
  }

  public static async refreshToken(): Promise<boolean> {
    let success: boolean = false;

    try {
      const resp = await HttpHelper.request(
        url + `refresh-token`,
        RequestType.post,
        undefined,
        false
      );

      if (resp.status === 200) {
        success = true;
        Logger.log("Token refreshed successfully.", resp.data);
      }
    } catch (e) {
      Logger.log(`Could not refresh token.`);
    }

    return success;
  }

  public static async getUser(id: number): Promise<TimelineUser | undefined> {
    let user: TimelineUser | undefined;

    try {
      const resp = await HttpHelper.request(
        url + `user?id=${id}`,
        RequestType.get
      );

      if (resp.status === 200) {
        Logger.log("Found user info.", resp.data);

        if (resp.data) {
          user = TimelineUser.fromJson(resp.data);
        }
      }
    } catch (e) {
      Logger.log(`Couldn't find user info.`);
    }

    return user;
  }

  public static async getCurrentUser(): Promise<TimelineUser | undefined> {
    let user: TimelineUser | undefined;

    try {
      const resp = await HttpHelper.request(
        url + `current-user`,
        RequestType.get
      );

      if (resp.status === 200) {
        Logger.log("Found current user info.", resp.data);

        if (resp.data) {
          user = TimelineUser.fromJson(resp.data);
        }
      }
    } catch (e) {
      Logger.log(`Couldn't find current user info.`);
    }

    return user;
  }

  public static async createType(
    name: string,
    type: TypesDrawerType
  ): Promise<boolean> {
    let success = false;

    try {
      const body = {
        name: name,
      };

      const resp = await HttpHelper.request(
        url +
          `${type === TypesDrawerType.category ? "categories" : "locations"}`,
        RequestType.post,
        body
      );

      if (resp.status === 200) {
        success = true;
        Logger.log("Created type.", resp.data);
      }
    } catch (e) {
      Logger.log(`Couldn't create type.`);
    }

    return success;
  }
}
