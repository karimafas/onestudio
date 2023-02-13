export class StudioUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  owner: boolean;
  avatarColor: string;

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    owner: boolean,
    avatarColor: string
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.owner = owner;
    this.avatarColor = avatarColor;
  }

  static fromJson(json: { [key: string]: any }) {
    return new StudioUser(
      json.id,
      json.firstName,
      json.lastName,
      json.email,
      json.owner,
      json.avatarColor
    );
  }

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
