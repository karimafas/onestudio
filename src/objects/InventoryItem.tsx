import moment from "moment";
import { ApiHelper } from "../helpers/ApiHelper";
import { Logger } from "../services/logger";
import { Constants } from "../utils/Constants";
import { TimelineEvent, TimelineEventType } from "./TimelineEvent";

export class InventoryItem {
  id: number;
  manufacturer: string;
  model: string;
  locationId: number;
  serial: string;
  mNumber: string;
  price: number;
  categoryId: number;
  ownerId: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;

  events: Array<TimelineEvent> = [];

  // Internal properties.
  selected: boolean = false;

  public get createdAtStr(): string {
    if (!this.createdAt) return "";
    return moment(this.createdAt).format(Constants.dateTimeFormat);
  }

  public get updatedAtStr(): string {
    if (!this.updatedAt) return "";
    return moment(this.updatedAt).format(Constants.dateTimeFormat);
  }

  async initEvents() {
    Logger.log(`Initialising event for item ${this.id}`);
    this.events = await ApiHelper.getItemEvents(this.id);
  }

  static fromJson(json: { [key: string]: any }) {
    return new InventoryItem(
      json["id"],
      json["manufacturer"],
      json["model"],
      json["location_id"],
      json["serial"],
      json["m_number"],
      json["price"],
      json["category_id"],
      json["owner_id"],
      json["notes"],
      moment(json["created_at"]).toDate(),
      moment(json["updated_at"]).toDate()
    );
  }

  constructor(
    id: number,
    manufacturer: string,
    model: string,
    locationId: number,
    serial: string,
    mNumber: string,
    price: number,
    categoryId: number,
    ownerId: number,
    notes: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.manufacturer = manufacturer;
    this.model = model;
    this.locationId = locationId;
    this.serial = serial;
    this.mNumber = mNumber;
    this.price = price;
    this.categoryId = categoryId;
    this.ownerId = ownerId;
    this.notes = notes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
