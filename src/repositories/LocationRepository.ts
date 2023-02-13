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

  public static async createLocation(name: string): Promise<boolean> {
    let success = false;

    try {
      const body = {
        name: name,
      };

      const resp = await RequestService.request(
        "location",
        RequestType.post,
        body
      );

      if (resp.status === 201) {
        success = true;
        LoggerService.log("Created location.", resp.data);
      }
    } catch (e) {
      LoggerService.log("Couldn't create location.");
    }

    return success;
  }

  public static async deleteLocation(id: number): Promise<boolean> {
    let success = false;

    try {
      const resp = await RequestService.request(
        `location/${id}`,
        RequestType.delete
      );

      if (resp.status === 200) {
        success = true;
        LoggerService.log("Deleted location.", resp.data);
      }
    } catch (e) {
      LoggerService.log("Couldn't delete location.");
    }

    return success;
  }
}
