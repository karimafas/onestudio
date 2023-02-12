import { Studio } from "./Studio";
import { StudioUser } from "./StudioUser";

export class RetrievedInvitationDto {
  id: number;
  studio: Studio;
  inviter: StudioUser;
  invitedEmail: string;

  constructor(
    id: number,
    studio: Studio,
    inviter: StudioUser,
    invitedEmail: string
  ) {
    this.id = id;
    this.studio = studio;
    this.inviter = inviter;
    this.invitedEmail = invitedEmail;
  }

  static fromJson(json: { [key: string]: any }) {
    return new RetrievedInvitationDto(
      json.id,
      Studio.fromJson(json.studio),
      StudioUser.fromJson(json.inviter),
      json.invitedEmail
    );
  }
}
