import { toFirstUpperCase } from "../helpers/StringHelper";

export enum PrimitiveStatuses {
  faulty = "faulty",
  repairing = "repairing",
  working = "working",
}

export class Status {
  id: number;
  name: string;
  primitive: boolean;

  constructor(id: number, name: string, primitive: boolean) {
    this.id = id;
    this.name = name;
    this.primitive = primitive;
  }

  static fromJson(json: { [key: string]: any }) {
    return new Status(json.id, json.name, json.primitive);
  }

  public get backgroundColor(): string {
    switch (this.name) {
      case PrimitiveStatuses.faulty:
        return "bg-red";
      case PrimitiveStatuses.working:
        return "bg-green";
      case PrimitiveStatuses.repairing:
        return "bg-grey";
      default:
        return "";
    }
  }

  public get displayName() {
    let value = "";
    this.name === "repairing" ? (value = "in repair") : (value = this.name);
    return toFirstUpperCase(value);
  }
}
