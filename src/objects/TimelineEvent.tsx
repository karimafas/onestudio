import moment from "moment";

export enum TimelineEventType {
  created,
  edited,
}

function stringToType(type: string): TimelineEventType {
  switch (type) {
    case "edit":
      return TimelineEventType.edited;
  }

  return TimelineEventType.created;
}

export class TimelineEvent {
  id: number;
  userId: number;
  createdAt: Date;
  type: TimelineEventType;

  constructor(
    id: number,
    userId: number,
    createdAt: Date,
    type: TimelineEventType
  ) {
    this.id = id;
    this.userId = userId;
    this.createdAt = createdAt;
    this.type = type;
  }

  static fromJson(json: { [key: string]: any }) {
    return new TimelineEvent(
      json["id"],
      json["user_id"],
      moment(json["created_at"]).toDate(),
      stringToType(json["type"])
    );
  }
}
