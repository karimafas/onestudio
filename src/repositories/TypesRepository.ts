import { TypesDialogType } from "../components/AddTypesDialog";
import { LoggerService } from "../services/LoggerService";
import { RequestService, RequestType } from "../services/RequestService";

export class TypesRepository {
  public static async createType(
    name: string,
    type: TypesDialogType
  ): Promise<boolean> {
    let success = false;

    try {
      const body = {
        name: name,
      };

      const resp = await RequestService.request(
        `${type === TypesDialogType.category ? "category" : "location"}`,
        RequestType.post,
        body
      );

      if (resp.status === 201) {
        success = true;
        LoggerService.log("Created type.", resp.data);
      }
    } catch (e) {
      LoggerService.log("Couldn't create type.");
    }

    return success;
  }

  public static async deleteType(
    id: number,
    type: TypesDialogType
  ): Promise<boolean> {
    let success = false;

    try {
      const resp = await RequestService.request(
        `${type === TypesDialogType.category ? "category" : "location"}/${id}`,
        RequestType.delete
      );

      if (resp.status === 200) {
        success = true;
        LoggerService.log("Deleted type.", resp.data);
      }
    } catch (e) {
      LoggerService.log("Couldn't delete type.");
    }

    return success;
  }
}
