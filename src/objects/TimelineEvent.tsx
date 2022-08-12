import moment from "moment";

export enum TimelineEventType {
  created,
  edited,
  fault,
  fix,
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
  createdAt: Date;
  type: TimelineEventType;
  notes: string;

  constructor(
    id: number,
    userId: number,
    createdAt: Date,
    type: TimelineEventType,
    notes: string
  ) {
    this.id = id;
    this.userId = userId;
    this.createdAt = createdAt;
    this.type = type;
    this.notes = notes;
  }

  static fromJson(json: { [key: string]: any }) {
    return new TimelineEvent(
      json["id"],
      json["user_id"],
      moment(json["created_at"]).toDate(),
      stringToType(json["type"]),
      json["notes"] ?? ""
    );
  }
}
