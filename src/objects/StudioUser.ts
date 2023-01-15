export class StudioUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  owner: boolean;

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    owner: boolean
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.owner = owner;
  }

  static fromJson(json: { [key: string]: any }) {
    return new StudioUser(
      json.id,
      json.firstName,
      json.lastName,
      json.email,
      json.owner
    );
  }
}
