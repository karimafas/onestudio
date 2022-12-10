import { TypesDrawerType } from "../components/TypesDrawer";
import { Category } from "../objects/Category";
import { InventoryItem } from "../objects/InventoryItem";
import { StudioLocation } from "../objects/StudioLocation";
import { TimelineEvent, TimelineEventType } from "../objects/TimelineEvent";
import { StudioUser } from "../objects/StudioUser";
import { Logger } from "../services/logger";
import { HttpHelper, RequestType } from "./HttpHelper";

const sleep = (s: number) => new Promise((p) => setTimeout(p, (s * 1000) | 0));

export enum SetOwnerType {
  grant,
  revoke,
}

function setOwnerTypeToString(type: SetOwnerType) {
  switch (type) {
    case SetOwnerType.grant:
      return "grant";
    case SetOwnerType.revoke:
      return "revoke";
  }
}

export class ApiHelper {
  public static async getInventoryItems(): Promise<Array<InventoryItem>> {
    let items: Array<InventoryItem> = [];

    try {
      const resp = await HttpHelper.request("item", RequestType.get);

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
      const resp = await HttpHelper.request("location", RequestType.get);

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
      const resp = await HttpHelper.request("category", RequestType.get);

      Logger.log("Loaded categories from API.", resp);

      const _categories = resp.data;

      if (_categories) {
        for (const category of _categories) {
          categories.push(Category.fromJson(category));
        }
      }
    } catch (e) {
      Logger.log("Couldn't load categories.");
    }

    return categories;
  }

  public static async getInventoryItem(
    id: number
  ): Promise<InventoryItem | undefined> {
    let item;

    try {
      const resp = await HttpHelper.request(`item/${id}`, RequestType.get);

      Logger.log(`Loaded inventory item with id ${id} from API.`, resp);
      if (resp.data) {
        try {
          item = InventoryItem.fromJson(resp.data);
          debugger;
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      Logger.log("Couldn't load items.");
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

      const resp = await HttpHelper.request("item", RequestType.post, body);

      if (resp.status === 201) {
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
        `items/${i.id}`,
        RequestType.put,
        body
      );

      if (resp.status === 200) {
        success = true;
        Logger.log("Updated item.", resp.data);
      }
    } catch (e) {
      Logger.log("Couldn't update item.", e);
    }

    return success;
  }

  public static async deleteItems(ids: Array<number>): Promise<boolean> {
    let success: boolean = false;
    try {
      const body = {
        ids: ids,
      };

      const resp = await HttpHelper.request('item/removeMany', RequestType.post, body);

      if (resp.status === 201) {
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
        `event/eventsForItem/${itemId}`,
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
        type: eventType,
      };

      const resp = await HttpHelper.request("event", RequestType.post, body);

      if (resp.status === 201) {
        success = true;
        Logger.log("Created event.", resp.data);
      }
    } catch (e) {
      Logger.log("Couldn't create event.");
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
        "auth/login",
        RequestType.post,
        body,
        false
      );

      if (resp.status === 201) {
        await sleep(1);
        success = true;
        Logger.log("Logged in user.", resp.data);
      }
    } catch (e) {
      Logger.log("Couldn't login user.");
    }

    return success;
  }

  public static async logout(): Promise<boolean> {
    let success: boolean = false;

    try {
      const resp = await HttpHelper.request("auth/logout", RequestType.post);

      if (resp.status === 201) {
        success = true;
        Logger.log("Logged out.", resp.data);
        window.location.reload();
      }
    } catch (e) {
      Logger.log("Couldn't log out user.");
    }

    return success;
  }

  public static async checkToken(): Promise<boolean> {
    let success: boolean = false;

    try {
      const resp = await HttpHelper.request(
        `jwt-token-chk`,
        RequestType.get,
        undefined,
        false
      );

      if (resp.status === 200) {
        success = true;
        Logger.log("Found valid token.", resp.data);
      }
    } catch (e) {
      Logger.log("Couldn't find valid token.");
    }

    return success;
  }

  public static async checkResetToken(token: string): Promise<boolean> {
    let success: boolean = false;

    try {
      const body = { token: token };

      const resp = await HttpHelper.request(
        "reset-token-chk",
        RequestType.post,
        body,
        false
      );

      if (resp.status === 200) {
        success = true;
        Logger.log("Found valid token.", resp.data);
      }
    } catch (e) {
      Logger.log("Couldn't find valid token.");
    }

    return success;
  }

  public static async refreshToken(): Promise<boolean> {
    let success: boolean = false;

    try {
      const resp = await HttpHelper.request(
        "auth/refreshToken",
        RequestType.post,
        {},
        false
      );

      if (resp.status === 201) {
        success = true;
        Logger.log("Token refreshed successfully.", resp.data);
      }
    } catch (e) {
      Logger.log("Could not refresh token.");
    }

    return success;
  }

  public static async getUser(id: number): Promise<StudioUser | undefined> {
    let user: StudioUser | undefined;

    try {
      const resp = await HttpHelper.request(`auth/user/${id}`, RequestType.get);

      if (resp.status === 200) {
        Logger.log("Found user info.", resp.data);

        if (resp.data) {
          user = StudioUser.fromJson(resp.data);
        }
      }
    } catch (e) {
      Logger.log("Couldn't find user info.");
    }

    return user;
  }

  public static async getCurrentUser(): Promise<StudioUser | undefined> {
    let user: StudioUser | undefined;

    try {
      const resp = await HttpHelper.request(
        "auth/currentUser",
        RequestType.get
      );

      if (resp.status === 200) {
        Logger.log("Found current user info.", resp.data);

        if (resp.data) {
          user = StudioUser.fromJson(resp.data);
        }
      }
    } catch (e) {
      Logger.log("Couldn't find current user info.");
    }

    return user;
  }

  public static async getStudioUsers(): Promise<Array<StudioUser>> {
    let users: Array<StudioUser> = [];

    try {
      const resp = await HttpHelper.request(
        "auth/studioUsers",
        RequestType.get
      );

      if (resp.status === 200) {
        Logger.log("Found studio users info.", resp.data);

        if (resp.data) {
          for (const jsonUser of resp.data) {
            users.push(StudioUser.fromJson(jsonUser));
          }
        }
      }
    } catch (e) {
      Logger.log("Couldn't find studio users info.");
    }

    return users;
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
        `${type === TypesDrawerType.category ? "category" : "location"}`,
        RequestType.post,
        body
      );

      if (resp.status === 201) {
        success = true;
        Logger.log("Created type.", resp.data);
      }
    } catch (e) {
      Logger.log("Couldn't create type.");
    }

    return success;
  }

  public static async deleteType(
    id: number,
    type: TypesDrawerType
  ): Promise<boolean> {
    let success = false;

    try {
      const resp = await HttpHelper.request(
        `${type === TypesDrawerType.category ? "category" : "location"}/${id}`,
        RequestType.delete
      );

      if (resp.status === 200) {
        success = true;
        Logger.log("Deleted type.", resp.data);
      }
    } catch (e) {
      Logger.log("Couldn't delete type.");
    }

    return success;
  }

  public static async getStats(
    period: "l7d" | "l30d" | "all",
    type: "fault" | "fix"
  ): Promise<{ success: boolean; data: any }> {
    let success = false;
    let data;

    try {
      const body = {
        type: type,
        period: period,
      };

      const resp = await HttpHelper.request("stats", RequestType.post, body);

      if (resp.status === 200) {
        success = true;
        Logger.log("Retrieved stats.", resp.data);
        data = resp.data;
      }
    } catch (e) {
      Logger.log("Couldn't retrieve stats.");
    }

    return { success: success, data: data };
  }

  public static async setOwner(
    id: number,
    type: SetOwnerType
  ): Promise<boolean> {
    let success = false;

    try {
      const body = {
        id: id,
        type: setOwnerTypeToString(type),
      };
      const resp = await HttpHelper.request("owner", RequestType.post, body);

      if (resp.status === 200) {
        success = true;
        Logger.log("Set owner.", resp.data);
      }
    } catch (e) {
      Logger.log("Couldn't set owner.");
    }

    return success;
  }

  public static async resetToken(email: string): Promise<boolean> {
    let success = false;

    try {
      const body = {
        email: email,
      };
      const resp = await HttpHelper.request(
        "reset-token",
        RequestType.post,
        body
      );

      if (resp.status === 200) {
        success = true;
        Logger.log(`Reset email sent.`);
      }
    } catch (e) {
      Logger.log("Couldn't send reset email.");
    }

    return success;
  }

  public static async resetPassword(
    token: string,
    password: string
  ): Promise<boolean> {
    let success = false;

    try {
      const body = {
        token: token,
        password: password,
      };
      const resp = await HttpHelper.request(
        "reset-password",
        RequestType.post,
        body
      );

      if (resp.status === 200) {
        success = true;
        Logger.log("Password reset.");
      }
    } catch (e) {
      Logger.log("Couldn't reset password.");
    }

    return success;
  }
}
