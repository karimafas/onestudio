import { UserTag } from "../components/UserTag";
import { collapseString } from "../helpers/StringHelpers";
import { Category } from "./Category";
import { InventoryItem } from "./InventoryItem";
import { StudioLocation } from "./StudioLocation";
import { StudioUser } from "./StudioUser";
import { TableColumn } from "./TableColumn";

export class TableItem {
  item?: InventoryItem;

  public get id(): number {
    return this.item?.id ?? 0;
  }

  constructor(item?: InventoryItem) {
    this.item = item;
  }

  public renderRow(
    columns: TableColumn[],
    onRowClick: Function,
    locations: StudioLocation[],
    categories: Category[],
    owners: StudioUser[]
  ) {
    return (
      <div
        className="flex flex-row w-full h-full items-center"
        onClick={() => onRowClick()}
      >
        {columns.map((c) => {
          const style = {
            width: `${100 / columns.length}%`,
            paddingRight: 30,
          };

          switch (c.id) {
            case "details":
              return (
                <div
                  onClick={() => onRowClick()}
                  className="flex flex-col justify-center h-full"
                  style={style}
                  key={`details-${c.id}`}
                >
                  <span className="font-bold text-[15px] mb-1">
                    {this.item?.manufacturer}
                  </span>
                  <span>{this.item?.model}</span>
                </div>
              );
            case "status":
              return (
                <div
                  className="flex flex-row items-center"
                  onClick={() => onRowClick()}
                >
                  <div
                    className={`h-2 w-2 ${this.item?.status.backgroundColor} rounded-[100%] mr-3`}
                  ></div>
                  <span>{this.item?.status.displayName}</span>
                </div>
              );
            case "owner":
              return (
                <div
                  className="flex flex-row"
                  style={style}
                  onClick={() => onRowClick()}
                >
                  <div className="h-[2.5em] w-[2.5em]">
                    <UserTag
                      user={
                        owners.filter((o) => o.id === this.item?.ownerId)[0]
                      }
                      pointer
                      tooltip
                    />
                  </div>
                </div>
              );
            default:
              return (
                <span
                  key={`txt-${c.id}-${this.id}}`}
                  className="h-full flex flex-col justify-center"
                  onClick={() => onRowClick()}
                  style={style}
                >
                  {this.columnText(c, locations, categories, owners)}
                </span>
              );
          }
        })}
      </div>
    );
  }

  public columnText(
    c: TableColumn,
    locations: StudioLocation[],
    categories: Category[],
    owners: StudioUser[]
  ): string {
    switch (c.id) {
      case "price":
        return `£${this.item?.price + ""}`;
      case "location":
        return locations.filter((l) => l.id == this.item?.locationId)[0].name;
      case "category":
        return categories.filter((c) => c.id == this.item?.categoryId)[0].name;
      case "owner":
        const owner = owners.filter((o) => o.id == this.item?.ownerId)[0];
        return `${owner.firstName} ${owner.lastName}`;
      case "serial":
        return this.item?.serial ?? "";
      case "notes":
        return collapseString(this.item?.notes);
      default:
        return "";
    }
  }

  static fromInventoryItem(i: InventoryItem) {
    return new TableItem(i);
  }
}
