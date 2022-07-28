import moment from "moment";
import { Constants } from "../utils/Constants";

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

  //   category: Category;
  //   location: StudioLocation;
  //   owner: Owner;

  //   initialise(
  //     categories: Array<Category>,
  //     locations: Array<StudioLocation>,
  //     owners: Array<Owner>
  //   ) {
  //     this.category = categories.filter((c) => c.id === this.categoryId)[0];
  //     this.location = locations.filter((l) => l.id === this.locationId)[0];
  //     this.owner = owners.filter((o) => o.id === this.ownerId)[0];
  //   }

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
