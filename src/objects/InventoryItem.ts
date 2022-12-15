import moment from "moment";
import { ApiHelper } from "../helpers/ApiHelper";
import { Logger } from "../services/logger";
import { Constants } from "../utils/Constants";
import { TimelineEvent } from "./TimelineEvent";
import { StudioUser } from "./StudioUser";

export enum ItemStatus {
  working = "working",
  faulty = "faulty",
}

function stringToStatus(status: "faulty" | "working"): ItemStatus {
  switch (status) {
    case "faulty":
      return ItemStatus.faulty;
    case "working":
      return ItemStatus.working;
  }
}

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
  createdBy: number;

  user?: StudioUser;

  status: ItemStatus;

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

  public async initEvents() {
    Logger.log(`Initialising event for item ${this.id}`);
    this.events = await ApiHelper.getItemEvents(this.id);
  }

  public async loadUser() {
    this.user = await ApiHelper.getUser(this.createdBy);
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
      moment(json["updated_at"]).toDate(),
      stringToStatus(json["status"]),
      json["created_by"]
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
    updatedAt: Date,
    status: ItemStatus,
    createdBy: number
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
    this.status = status;
    this.createdBy = createdBy;
  }

  static fromDfo(i: ItemDfo): ItemUpdateDto {
    return {
      manufacturer: i.manufacturer,
      model: i.model,
      location_id: parseInt(i.location_id),
      serial: i.serial,
      m_number: i.m_number,
      price: parseFloat(i.price),
      category_id: parseInt(i.category_id),
      owner_id: parseInt(i.owner_id),
      notes: i.notes,
      updated_at: new Date(),
    };
  }
}

export interface ItemDfo {
  id: number;
  manufacturer: string;
  model: string;
  location_id: string;
  serial: string;
  m_number: string;
  price: string;
  category_id: string;
  owner_id: string;
  notes: string;
  status: ItemStatus;
}

export interface ItemUpdateDto {
  id?: number;
  manufacturer?: string;
  model?: string;
  location_id?: number;
  serial?: string;
  m_number?: string;
  price?: number;
  category_id?: number;
  owner_id?: number;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
  status?: ItemStatus;
  created_by?: number;
}
