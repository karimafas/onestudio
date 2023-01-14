import moment from "moment";
import { LoggerService } from "../services/LoggerService";
import { Constants } from "../utils/Constants";
import { TimelineEvent } from "./TimelineEvent";
import { StudioUser } from "./StudioUser";
import { EventRepository } from "../repositories/EventRepository";
import { AuthRepository } from "../repositories/AuthRepository";
import { Status } from "./Status";

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

  status: Status;

  events: TimelineEvent[] = [];

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
    LoggerService.log(`Initialising event for item ${this.id}`);
    this.events = await EventRepository.getItemEvents(this.id);
  }

  public async loadUser() {
    this.user = await AuthRepository.getUser(this.createdBy);
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
      Status.fromJson(json["status"]),
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
    status: Status,
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

  static fromDfo(i: ItemDfo): ItemDto {
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

  static fromCsvDfo(i: CsvItemDfo) {
    return {
      manufacturer: i.manufacturer,
      model: i.model,
      location: i.location,
      serial: i.serial,
      m_number: i.m_number,
      price: parseFloat(i.price),
      category: i.category,
      owner: i.owner,
      notes: i.notes,
    };
  }
}

export interface ItemDfo {
  id?: number;
  manufacturer: string;
  model: string;
  location_id: string;
  serial: string;
  m_number: string;
  price: string;
  category_id: string;
  owner_id: string;
  notes: string;
}

export interface CsvItemDfo {
  manufacturer: string;
  model: string;
  location: string;
  serial: string;
  m_number: string;
  price: string;
  category: string;
  owner: string;
  notes: string;
}

export interface CsvItemDto {
  manufacturer?: string;
  model?: string;
  location?: string;
  serial?: string;
  m_number?: string;
  price?: number;
  category?: string;
  owner?: string;
  notes?: string;
}

export interface ItemDto {
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
  created_by?: number;
}
