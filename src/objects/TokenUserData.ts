export class TokenUserData {
  userId: number;
  studioId: number;
  email: string;

  constructor(userId: number, studioId: number, email: string) {
    this.userId = userId;
    this.studioId = studioId;
    this.email = email;
  }
}
