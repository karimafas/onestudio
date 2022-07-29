export enum TimelineEventType {
  created,
  edited,
}

export class TimelineEvent {
  userId: number;
  createdAt: Date;
  type: TimelineEventType;

  constructor(userId: number, createdAt: Date, type: TimelineEventType) {
    this.userId = userId;
    this.createdAt = createdAt;
    this.type = type;
  }
}
