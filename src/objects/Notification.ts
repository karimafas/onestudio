import { Comment } from "./Comment";
import { InventoryItem } from "./InventoryItem";
import { StudioUser } from "./StudioUser";

export enum NotificationType {
  commentMention = "commentMention",
}

export class Notification {
  id: number;
  userId: number;
  itemId: number;
  studioId: number;
  type: NotificationType;
  createdAt: Date;
  targetUserId: number;
  seen: boolean;
  commentId?: number;
  viewedAt?: Date;

  user?: StudioUser;
  targetUser?: StudioUser;
  item?: InventoryItem;

  constructor(
    id: number,
    userId: number,
    itemId: number,
    studioId: number,
    type: NotificationType,
    createdAt: Date,
    targetUserId: number,
    seen: boolean,
    commentId?: number,
    viewedAt?: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.itemId = itemId;
    this.studioId = studioId;
    this.type = type;
    this.createdAt = createdAt;
    this.targetUserId = targetUserId;
    this.seen = seen;
    this.commentId = commentId;
    this.viewedAt = viewedAt;
  }

  static fromJson(json: { [key: string]: any }): Notification {
    return new Notification(
      json.id,
      json.userId,
      json.itemId,
      json.studioId,
      json.type,
      json.createdAt,
      json.targetUserId,
      json.seen,
      json.commentId,
      json.viewedAt
    );
  }

  public initialise(users: StudioUser[], items: InventoryItem[]) {
    this.user = users.filter((u) => u.id === this.userId)[0];
    this.targetUser = users.filter((u) => u.id === this.targetUserId)[0];
    this.item = items.filter((i) => i.id === this.itemId)[0];
  }

  public get drawerText() {
    switch (this.type) {
      case NotificationType.commentMention:
        return `${this.user?.fullName} mentioned you in a comment.`;
    }
  }
}
