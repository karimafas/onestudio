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
}
