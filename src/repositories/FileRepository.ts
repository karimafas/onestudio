import { FileUpload } from "../objects/FileUpload";
import { LoggerService } from "../services/LoggerService";
import { RequestService, RequestType } from "../services/RequestService";

export class FileRepository {
  public static async createFile(
    name: string,
    url: string,
    itemId: number,
    commentId: number
  ): Promise<{ success: boolean; file: FileUpload | undefined }> {
    let success: boolean = false;
    let file: FileUpload | undefined;

    try {
      const body = {
        name,
        url,
        itemId,
        commentId,
      };

      const resp = await RequestService.request("file", RequestType.post, body);

      if (resp.status === 201) {
        success = true;
        LoggerService.log("Created file.", resp.data);
      }
    } catch (e) {
      LoggerService.log("Couldn't create file.");
    }

    return { success, file };
  }

  public static async deleteAttachments(ids: number[]): Promise<boolean> {
    let success = false;

    try {
      const body = {
        ids,
      };

      const resp = await RequestService.request(
        `file/deleteMany`,
        RequestType.post,
        body
      );

      if (resp.status === 201) {
        success = true;
        LoggerService.log("Deleted attachments.", resp.data);
      }
    } catch (e) {
      LoggerService.log("Couldn't delete attachments.");
    }

    return success;
  }
}
