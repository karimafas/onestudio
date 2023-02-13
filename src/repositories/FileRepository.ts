import { ref, deleteObject } from "firebase/storage";
import { FileUpload } from "../objects/FileUpload";
import { LoggerService } from "../services/LoggerService";
import { RequestService, RequestType } from "../services/RequestService";
import storage from "../firebaseConfig";

export class FileRepository {
  public static async createFile(
    name: string,
    path: string,
    url: string,
    commentId: number,
    itemId: number
  ): Promise<{ success: boolean; file: FileUpload | undefined }> {
    let success: boolean = false;
    let file: FileUpload | undefined;

    try {
      const body = {
        name,
        path,
        url,
        commentId,
        itemId,
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

  public static async deleteAttachments(files: FileUpload[]): Promise<boolean> {
    let success = false;

    try {
      for (const file of files) {
        const storageRef = ref(storage, file.path);
        await deleteObject(storageRef);
      }
    } catch (e) {
      LoggerService.log("Could not delete files from storage.");
    }

    try {
      const ids = files.map((f) => f.id);
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
