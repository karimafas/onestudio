import { StudioActivity } from "../objects/StudioActivity";
import { StudioLocation } from "../objects/StudioLocation";
import { LoggerService } from "../services/LoggerService";
import { RequestService, RequestType } from "../services/RequestService";

export class ActivityRepository {
  public static async getStudioActivity(): Promise<StudioActivity[]> {
    let activity: StudioActivity[] = [];

    try {
      const resp = await RequestService.request("activity", RequestType.get);

      LoggerService.log("Loaded studio activity from API.", resp);

      const _activity = resp.data;

      if (_activity) {
        for (const a of _activity) {
          activity.push(StudioActivity.fromJson(a));
        }
      }
    } catch (e) {
      LoggerService.log(`Couldn't load studio activity.`);
    }

    return activity;
  }

  public static async lastUserActivity(
    userId: number
  ): Promise<{ activity: StudioActivity | undefined; success: boolean }> {
    let activity: StudioActivity | undefined;
    let success: boolean = false;

    try {
      const resp = await RequestService.request(
        `activity/user/${userId}`,
        RequestType.get
      );

      LoggerService.log("Loaded last user activity.");

      if (resp.status === 200) {
        success = true;
        activity = StudioActivity.fromJson(resp.data);
      }
    } catch (e) {
      LoggerService.log(`Couldn't load last user event.`);
    }

    return { activity: activity, success: success };
  }
}
