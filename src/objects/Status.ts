export enum PrimitiveStatuses {
  faulty = "faulty",
  repairing = "repairing",
  working = "working",
}

export class Status {
  id: number;
  name: string;
  displayName?: string;
  primitive: boolean;

  constructor(id: number, name: string, primitive: boolean) {
    this.id = id;
    this.name = name;
    this.displayName = name === "repairing" ? "in repair" : name;
    this.primitive = primitive;
  }

  static fromJson(json: { [key: string]: any }) {
    return new Status(json.id, json.name, json.primitive);
  }
}
