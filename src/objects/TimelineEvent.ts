import moment from "moment";
import { StudioUser } from "./StudioUser";

export enum TimelineEventType {
  created = "created",
  edited = "edited",
  fault = "fault",
  fix = "fix",
}

function stringToType(type: string): TimelineEventType {
  switch (type) {
    case "created":
      return TimelineEventType.created;
    case "edit":
      return TimelineEventType.edited;
    case "fault":
      return TimelineEventType.fault;
    case "fix":
      return TimelineEventType.fix;
  }

  return TimelineEventType.created;
}

export class TimelineEvent {
  id: number;
  userId: number;
  userName: string;
  createdAt: Date;
  type: TimelineEventType;
  notes: string;
  itemId: number;

  constructor(
    id: number,
    userId: number,
    userName: string,
    createdAt: Date,
    type: TimelineEventType,
    notes: string,
    itemId: number
  ) {
    this.id = id;
    this.userId = userId;
    this.userName = userName;
    this.createdAt = createdAt;
    this.type = type;
    this.notes = notes;
    this.itemId = itemId;
  }

  static fromJson(json: { [key: string]: any }) {
    return new TimelineEvent(
      json["id"],
      json["user_id"],
      json["user_name"],
      moment(json["created_at"]).toDate(),
      stringToType(json["type"]),
      json["notes"] ?? "",
      json["item_id"]
    );
  }
}
