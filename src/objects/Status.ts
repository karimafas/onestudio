export enum PrimitiveStatuses {
  faulty = "faulty",
  repairing = "repairing",
  working = "working",
}

export class Status {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static fromJson(json: { [key: string]: any }) {
    return new Status(json["id"], json["name"]);
  }
}
