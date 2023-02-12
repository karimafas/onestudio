export class Studio {
  id: number;
  name: string;
  createdAt: Date;

  constructor(id: number, name: string, createdAt: Date) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
  }

  static fromJson(json: { [key: string]: any }): Studio {
    return new Studio(json.id, json.name, json.createdAt);
  }
}
