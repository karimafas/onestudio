import { AxiosResponse } from "axios";
import { RetrievedInvitationDto } from "../objects/RetrievedInvitationDto";
import { LoggerService } from "../services/LoggerService";
import { RequestService, RequestType } from "../services/RequestService";

export class InvitationRepository {
  static async sendInvitation(email: string): Promise<boolean> {
    let success = false;

    try {
      const body = {
        email,
      };
      const resp: AxiosResponse = await RequestService.request(
        "invitation",
        RequestType.post,
        body
      );

      if (resp.data) success = resp.data.success;

      LoggerService.log("Loaded retrieved invitation.");
    } catch (e) {
      LoggerService.log("Could not send invitation.");
    }

    return success;
  }

  static async retrieveInvitation(token: string) {
    let success = false;
    let invitation: RetrievedInvitationDto | undefined;

    try {
      const resp: AxiosResponse = await RequestService.request(
        `invitation/${token}`,
        RequestType.get
      );

      if (resp.data) {
        invitation = RetrievedInvitationDto.fromJson(resp.data);
        success = true;
      }

      LoggerService.log("Loaded retrieved invitation.");
    } catch (e) {
      LoggerService.log("Could not send invitation.");
    }

    return { success, invitation };
  }
}
