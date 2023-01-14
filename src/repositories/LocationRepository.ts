import { StudioLocation } from "../objects/StudioLocation";
import { LoggerService } from "../services/LoggerService";
import { RequestService, RequestType } from "../services/RequestService";

export class LocationRepository {
  public static async getLocations(): Promise<StudioLocation[]> {
    let locations: StudioLocation[] = [];

    try {
      const resp = await RequestService.request("location", RequestType.get);

      LoggerService.log("Loaded locations from API.", resp);

      const _locations = resp.data;

      if (_locations) {
        for (const location of _locations) {
          locations.push(StudioLocation.fromJson(location));
        }
      }
    } catch (e) {
      LoggerService.log(`Couldn't load locations.`);
    }

    return locations;
  }
}
