import { Comment } from "../objects/Comment";
import { LoggerService } from "../services/LoggerService";
import { RequestService, RequestType } from "../services/RequestService";

export class CommentRepository {
  public static async getItemComments(itemId: number): Promise<Comment[]> {
    let comments: Comment[] = [];

    try {
      const resp = await RequestService.request(
        `comment/item/${itemId}`,
        RequestType.get
      );

      const _comments = resp.data;

      if (_comments) {
        for (const comment of _comments) {
          const c = Comment.fromJson(comment);
          comments.push(c);
        }
      }
    } catch (e) {
      LoggerService.log(`Couldn't load comments.`);
    }

    return comments;
  }

  public static async createComment(
    itemId: number,
    body: string
  ): Promise<boolean> {
    let success = false;

    try {
      const payload = {
        itemId: itemId,
        body: body,
      };

      const resp = await RequestService.request(
        "comment",
        RequestType.post,
        payload
      );

      if (resp.status === 201) {
        success = true;
        LoggerService.log("Created comment.", resp.data);
      }
    } catch (e) {
      LoggerService.log("Couldn't create comment.");
    }

    return success;
  }

  public static async updateComment(
    id: number,
    body: string
  ): Promise<boolean> {
    let success = false;

    try {
      const payload = { body: body };

      const resp = await RequestService.request(
        `comment/${id}`,
        RequestType.patch,
        payload
      );

      if (resp.status === 200) {
        success = true;
        LoggerService.log("Updated comment.", resp.data);
      }
    } catch (e) {
      LoggerService.log("Couldn't update comment.");
    }

    return success;
  }

  public static async deleteComment(id: number): Promise<boolean> {
    let success = false;

    try {
      const resp = await RequestService.request(
        `comment/${id}`,
        RequestType.delete
      );

      if (resp.status === 200) {
        success = true;
        LoggerService.log("Deleted comment.", resp.data);
      }
    } catch (e) {
      LoggerService.log("Couldn't delete comment.");
    }

    return success;
  }
}
