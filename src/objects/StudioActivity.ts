export enum ActivityType {
  comment = "comment",
  creation = "creation",
  duplication = "duplication",
  invitation = "invitation",
  edit = "edit",
  statusChange = "statusChange",
}

export class StudioActivity {
  type: ActivityType;
  itemId: number;
  userId: number;
  createdAt: Date;

  constructor(
    type: ActivityType,
    itemId: number,
    userId: number,
    createdAt: Date
  ) {
    this.type = type;
    this.itemId = itemId;
    this.userId = userId;
    this.createdAt = createdAt;
  }

  static fromJson(json: { [key: string]: any }): StudioActivity {
    return new StudioActivity(
      json.type,
      json.itemId,
      json.userId,
      json.createdAt
    );
  }
}
