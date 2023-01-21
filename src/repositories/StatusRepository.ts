import { InventoryItem } from "../objects/InventoryItem";
import { Status } from "../objects/Status";
import { LoggerService } from "../services/LoggerService";
import { RequestService, RequestType } from "../services/RequestService";

export class StatusRepository {
  public static async getStatuses(): Promise<Status[]> {
    let statuses: Status[] = [];

    try {
      const resp = await RequestService.request("status", RequestType.get);

      LoggerService.log("Loaded statuses from API.", resp);

      const _statuses = resp.data;

      if (_statuses) {
        for (const status of _statuses) {
          statuses.push(Status.fromJson(status));
        }
      }
    } catch (e) {
      LoggerService.log("Couldn't load statuses.");
    }

    return statuses;
  }

  public static async createStatus(name: string): Promise<boolean> {
    let success: boolean = false;

    try {
      const resp = await RequestService.request("status", RequestType.post, {
        name: name,
      });

      if (resp.status === 201) {
        success = true;
      }

      LoggerService.log("Added new status.", success);
    } catch (e: any) {
      LoggerService.log(e.toString());
    }

    return success;
  }

  public static async deleteStatus(id: number): Promise<boolean> {
    let success: boolean = false;
    let deletingPrimitive: boolean = false;

    let resp;
    try {
      resp = await RequestService.request(`status/${id}`, RequestType.delete);

      if (resp.status === 200) {
        success = true;
        LoggerService.log("Deleted status.", resp.data);
      }
    } catch (e) {
      LoggerService.log(`Couldn't delete status.`);
      deletingPrimitive = resp.data.code === "deleting-primitive-status";
    }

    return success;
  }

  public static async changeStatus(
    newStatusId: number,
    itemId: number
  ): Promise<{ success: boolean; item: InventoryItem | undefined }> {
    let success = false;
    let item: InventoryItem | undefined;

    try {
      const body = {
        itemId: itemId,
        statusId: newStatusId,
      };

      const resp = await RequestService.request(
        "status/change",
        RequestType.post,
        body
      );

      if (resp.status === 201) {
        success = true;
        item = InventoryItem.fromJson(resp.data);
        LoggerService.log("Changed item status.", resp.data);
      }
    } catch (e) {
      success = false;
      LoggerService.log("Couldn't change item status.");
    }

    return { success, item };
  }
}
