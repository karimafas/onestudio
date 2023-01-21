import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { AppConstants } from "../config/AppConstants";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { InventoryItem } from "../objects/InventoryItem";
import { TableColumn } from "../objects/TableColumn";
import { CheckBox } from "./CheckBox";
import { HeaderCheckBox } from "./HeaderCheckBox";

export function InventoryTable(props: {
  searchQuery: string;
  selected: number[];
  setSelected: Function;
  itemsPerPage: number;
  width: number;
  items: InventoryItem[];
  filteredItems: InventoryItem[];
  page: number;
  setPage: Function;
  totalPages: number;
}) {
  const { items, filteredItems, page, setPage, totalPages } = props;
  const navigate = useNavigate();
  const locations = useAppSelector((state) => state.data.locations);
  const categories = useAppSelector((state) => state.data.categories);
  const owners = useAppSelector((state) => state.data.studioUsers);
  const filteredColumns =
    props.width > 1070
      ? AppConstants.tableColumns
      : AppConstants.tableColumns.filter((c) => c.priority === 0);

  function columnToItemText(c: TableColumn, i: InventoryItem): string {
    switch (c.id) {
      case "price":
        return `£${i.price + ""}`;
      case "location":
        return locations.filter((l) => l.id == i.locationId)[0].name;
      case "category":
        return categories.filter((c) => c.id == i.categoryId)[0].name;
      case "owner":
        const owner = owners.filter((o) => o.id == i.ownerId)[0];
        return `${owner.firstName} ${owner.lastName}`;
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
      width: `${100 / filteredColumns.length}%`,
      paddingRight: 30,
    };
    switch (c.id) {
      case "details":
        return (
          <div
            onClick={() => navigate(`${i.id}`)}
            className="flex flex-col justify-center h-full"
            style={style}
            key={`details-${c.id}`}
          >
            <span className="font-bold text-[15px] mb-1">{i.manufacturer}</span>
            <span>{i.model}</span>
          </div>
        );
      case "select":
        return (
          <div
            key={`select-${c.id}`}
            style={style}
            className="flex flex-row justify-center"
          >
            <CheckBox
              selected={props.selected.includes(i.id)}
              onClick={() => {
                if (props.selected.includes(i.id)) {
                  const index: number = props.selected.indexOf(i.id);
                  props.setSelected(
                    props.selected.filter((id, i) => i !== index)
                  );
                } else {
                  props.setSelected([...props.selected, i.id]);
                }
              }}
            />
          </div>
        );
      case "status":
        return (
          <div className="flex flex-row items-center">
            <div
              className={`h-2 w-2 ${i.status.backgroundColor} rounded-[100%] mr-3`}
            ></div>
            <span>{i.status.displayName}</span>
          </div>
        );
      default:
        return (
          <span
            key={`txt-${c.id}-${i.id}-${columnToItemText(c, i)}`}
            className="h-full flex flex-col justify-center"
            onClick={() => navigate(`${i.id}`)}
            style={style}
          >
            {columnToItemText(c, i)}
          </span>
        );
    }
  }

  function getHeaderContent(c: TableColumn) {
    const style = {
      width: `${100 / filteredColumns.length}%`,
      paddingRight: 30,
    };
    switch (c.id) {
      case "select":
        return (
          <div
            key="select-col"
            style={style}
            className="flex flex-row justify-center"
          >
            <HeaderCheckBox
              selectedCount={
                props.selected.filter((i) =>
                  items.map((fi) => fi.id).includes(i)
                ).length
              }
              totalCount={items.length}
              deselectAll={() => props.setSelected([])}
              selectAll={() => props.setSelected(items.map((i) => i.id))}
            />
          </div>
        );
      default:
        return (
          <span
            className="whitespace-nowrap"
            key={`header-${c.id}`}
            style={style}
          >
            {c.name}
          </span>
        );
    }
  }

  return (
    <div className="flex flex-col justify-between grow">
      <div>
        <div className="w-full flex flex-row mt-8 font-semibold text-xs text-light_purple mb-4 px-4">
          {filteredColumns.map((c) => getHeaderContent(c))}
        </div>
        {filteredItems.map((i) => (
          <div
            className="w-full h-20 bg-white shadow-lg rounded-lg text-dark_blue text-xs flex flex-row items-center px-4 font-medium mb-4 cursor-pointer"
            key={`item-${i.id}`}
          >
            {filteredColumns.map((c) => getRowContent(c, i))}
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-center mb-6">
        <div
          className={`${
            page === 0 ? "opacity-30" : "cursor-pointer"
          } flex flex-col items-center justify-center w-8 h-8 bg-light_purple2 rounded-lg`}
          onClick={() => {
            if (page === 0) return;
            setPage(page - 1);
          }}
        >
          <img className="w-[5.5px]" src={ImageHelper.image(Images.backBlue)} />
        </div>
        <div className="h-8 w-12 bg-light_purple2 mx-4 rounded-lg flex flex-row justify-center items-center text-xs font-semibold text-light_purple">
          {page + 1} / {!totalPages ? 1 : totalPages}
        </div>
        <div
          className={`${
            page === totalPages - 1 ? "opacity-30" : "cursor-pointer"
          } flex flex-col items-center justify-center w-8 h-8 bg-light_purple2 rounded-lg`}
          onClick={() => {
            if (page === totalPages - 1) return;
            setPage(page + 1);
          }}
        >
          <img
            className="w-[5.5px]"
            src={ImageHelper.image(Images.forwardBlue)}
          />
        </div>
      </div>
    </div>
  );
}
