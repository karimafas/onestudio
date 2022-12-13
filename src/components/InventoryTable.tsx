import { useState } from "react";
import { useAppSelector } from "../app/hooks";
import { InventoryItem } from "../objects/InventoryItem";
import { CheckBox } from "./CheckBox";
import { HeaderCheckBox } from "./HeaderCheckBox";

class TableColumn {
  id: string;
  name: string;
  required: boolean;
  widthPercent: number;

  constructor(
    id: string,
    name: string,
    required: boolean,
    widthPercent: number
  ) {
    this.id = id;
    this.name = name;
    this.required = required;
    this.widthPercent = widthPercent;
  }
}

const columns = [
  new TableColumn("select", "", true, 5),
  new TableColumn("details", "Details", true, 10),
  new TableColumn("price", "Price", true, 5),
  new TableColumn("location", "Location", true, 10),
  new TableColumn("category", "Category", true, 10),
  new TableColumn("owner", "Owner", true, 10),
  new TableColumn("mNumber", "M-Number", true, 15),
  new TableColumn("serial", "Serial", true, 10),
  new TableColumn("notes", "Notes", true, 10),
];

export function InventoryTable(props: {
  searchQuery: string;
  selected: number[];
  setSelected: Function;
}) {
  const [page, setPage] = useState<number>(0);
  const items = useAppSelector((state) => state.data.items);
  const locations = useAppSelector((state) => state.data.locations);
  const categories = useAppSelector((state) => state.data.categories);
  const owners = useAppSelector((state) => state.data.studioUsers);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const filteredItems = items
    .filter(
      (i) =>
        i.manufacturer
          .toLowerCase()
          .includes(props.searchQuery.toLowerCase()) ||
        i.model.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
        i.price
          .toString()
          .toLowerCase()
          .includes(props.searchQuery.toLowerCase()) ||
        i.mNumber.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
        i.serial.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
        i.notes.toLowerCase().includes(props.searchQuery.toLowerCase())
    )
    .slice(page * itemsPerPage, itemsPerPage * (page + 1));

  function columnToItemText(c: TableColumn, i: InventoryItem): string {
    switch (c.id) {
      case "price":
        return i.price + "";
      case "location":
        return locations.filter((l) => l.id == i.categoryId)[0].name;
      case "category":
        return categories.filter((c) => c.id == i.categoryId)[0].name;
      case "owner":
        const owner = owners.filter((o) => o.id == i.ownerId)[0];
        return `${owner.firstName} ${owner.lastName}`;
      case "mNumber":
        return i.mNumber;
      case "serial":
        return i.serial;
      case "notes":
        return i.notes;
      default:
        return "";
    }
  }

  function getRowContent(c: TableColumn, i: InventoryItem) {
    const style = {
      width: `${c.widthPercent}%`,
      marginRight: 30,
    };
    switch (c.id) {
      case "details":
        return (
          <div className="flex flex-col" style={style}>
            <span className="font-bold text-[15px] mb-1">{i.manufacturer}</span>
            <span>{i.model}</span>
          </div>
        );
      case "select":
        return (
          <div style={style} className="flex flex-row justify-center">
            <CheckBox
              selected={props.selected.includes(i.id)}
              onClick={() => {
                if (props.selected.includes(i.id)) {
                  const index: number = props.selected.indexOf(i.id);
                  props.setSelected(props.selected.filter((id, i) => i !== index));
                } else {
                  props.setSelected([...props.selected, i.id]);
                }
              }}
            />
          </div>
        );
      default:
        return <span style={style}>{columnToItemText(c, i)}</span>;
    }
  }

  function getHeaderContent(c: TableColumn) {
    const style = {
      width: `${c.widthPercent}%`,
      marginRight: 30,
    };
    switch (c.id) {
      case "select":
        return (
          <div style={style} className="flex flex-row justify-center">
            <HeaderCheckBox
              selectedCount={props.selected.length}
              totalCount={items.length}
              deselectAll={() => props.setSelected([])}
              selectAll={() => props.setSelected(items.map((i) => i.id))}
            />
          </div>
        );
      default:
        return <span style={style}>{c.name}</span>;
    }
  }

  return (
    <div className="flex flex-col justify-between grow">
      <div>
        <div className="w-full flex flex-row mt-8 font-semibold text-xs text-light_purple mb-4 px-4">
          {columns.map((c) => getHeaderContent(c))}
        </div>
        {filteredItems.map((i) => (
          <div className="w-full h-20 bg-white shadow-lg rounded-lg text-dark_blue text-xs flex flex-row items-center px-4 font-medium mb-4 cursor-pointer">
            {columns.map((c) => getRowContent(c, i))}
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-center mb-6">
        <div
          className="flex flex-col items-center justify-center w-8 h-8 bg-light_purple2 rounded-lg cursor-pointer"
          onClick={() => {
            if (page === 0) return;
            setPage(page - 1);
          }}
        >
          <img
            className="w-[5.5px]"
            src={require("../assets/images/back-blue.png")}
          />
        </div>
        <div className="h-8 w-12 bg-light_purple2 mx-4 rounded-lg flex flex-row justify-center items-center text-xs font-semibold text-light_purple">
          {page + 1} / {totalPages}
        </div>
        <div
          className="flex flex-col items-center justify-center w-8 h-8 bg-light_purple2 rounded-lg cursor-pointer"
          onClick={() => {
            if (page === totalPages - 1) return;
            setPage(page + 1);
          }}
        >
          <img
            className="w-[5.5px]"
            src={require("../assets/images/forward-blue.png")}
          />
        </div>
      </div>
    </div>
  );
}
