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

  // Internal properties.
  selected: boolean = false;

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
      json["notes"]
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
    notes: string
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
  }
}
