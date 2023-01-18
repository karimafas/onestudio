export class Comment {
  id: number;
  userId: number;
  itemId: number;
  body: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    userId: number,
    itemId: number,
    body: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.itemId = itemId;
    this.body = body;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJson(json: { [key: string]: any }) {
    return new Comment(
      json.id,
      json.userId,
      json.itemId,
      json.body,
      json.createdAt,
      json.updatedAt
    );
  }
}
