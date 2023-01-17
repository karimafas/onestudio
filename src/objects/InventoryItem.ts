import moment from "moment";
import { LoggerService } from "../services/LoggerService";
import { Constants } from "../utils/Constants";
import { TimelineEvent } from "./TimelineEvent";
import { StudioUser } from "./StudioUser";
import { EventRepository } from "../repositories/EventRepository";
import { AuthRepository } from "../repositories/AuthRepository";
import { Status } from "./Status";
import { Comment } from "./Comment";
import { CommentRepository } from "../repositories/CommentRepository";

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
  userId: number;

  user?: StudioUser;

  status: Status;

  events: TimelineEvent[] = [];
  comments: Comment[] = [];

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

  public async loadComments() {
    LoggerService.log(`Loading comments for item ${this.id}`);
    this.comments = await CommentRepository.getItemComments(this.id);
  }

  static fromJson(json: { [key: string]: any }) {
    return new InventoryItem(
      json.id,
      json.manufacturer,
      json.model,
      json.locationId,
      json.serial,
      json.mNumber,
      json.price,
      json.categoryId,
      json.ownerId,
      json.notes,
      moment(json.createdAt).toDate(),
      moment(json.updatedAt).toDate(),
      Status.fromJson(json.status),
      json.userId
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
    userId: number
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
    this.userId = userId;
  }

  static fromDfo(i: ItemDfo): ItemDto {
    return {
      manufacturer: i.manufacturer,
      model: i.model,
      locationId: parseInt(i.locationId),
      serial: i.serial,
      mNumber: i.mNumber,
      price: parseFloat(i.price),
      categoryId: parseInt(i.categoryId),
      ownerId: parseInt(i.ownerId),
      notes: i.notes,
      updatedAt: new Date(),
    };
  }

  static fromCsvDfo(i: CsvItemDfo) {
    return {
      manufacturer: i.manufacturer,
      model: i.model,
      location: i.location,
      serial: i.serial,
      mNumber: i.mNumber,
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
  locationId: string;
  serial: string;
  mNumber: string;
  price: string;
  categoryId: string;
  ownerId: string;
  notes: string;
}

export interface CsvItemDfo {
  manufacturer: string;
  model: string;
  location: string;
  serial: string;
  mNumber: string;
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
  mNumber?: string;
  price?: number;
  category?: string;
  owner?: string;
  notes?: string;
}

export interface ItemDto {
  id?: number;
  manufacturer?: string;
  model?: string;
  locationId?: number;
  serial?: string;
  mNumber?: string;
  price?: number;
  categoryId?: number;
  ownerId?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number;
}
