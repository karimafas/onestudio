import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import "./InventoryTable.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { InventoryItem } from "../objects/InventoryItem";
import { Checkbox } from "@mui/material";
import { selectItem } from "../features/data/dataSlice";
import { useNavigate } from "react-router-dom";

interface Column {
  id:
    | "chk"
    | "manufacturer"
    | "model"
    | "location"
    | "category"
    | "owner"
    | "mNumber"
    | "serial"
    | "notes";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "chk", label: "", minWidth: 30 },
  { id: "manufacturer", label: "Manufacturer", minWidth: 100 },
  { id: "model", label: "Model", minWidth: 170 },
  { id: "location", label: "Location", minWidth: 60 },
  { id: "category", label: "Category", minWidth: 60 },
  { id: "owner", label: "Owner", minWidth: 60 },
  { id: "mNumber", label: "M-Number", minWidth: 100 },
  { id: "serial", label: "Serial", minWidth: 100 },
  { id: "notes", label: "Notes", minWidth: 170 },
];

function getItemValue(column: string, item: InventoryItem): string {
  switch (column) {
    case "manufacturer":
      return item.manufacturer;
    case "model":
      return item.model;
    case "location":
      return item.locationId.toString();
    case "category":
      return item.categoryId.toString();
    case "owner":
      return item.ownerId.toString();
    case "mNumber":
      return item.mNumber;
    case "serial":
      return item.serial;
    case "notes":
      return item.notes;
  }

  return "";
}

function SelectedHeader() {
  return <div className="ivt-table__header">13 selected</div>;
}

export default function InventoryTable() {
  const search = useAppSelector(
    (state) => state.inventory.search
  ).toLowerCase();
  const items = useAppSelector((state) => state.data.items);
  const rows = useAppSelector((state) =>
    state.data.items.filter(
      (r) =>
        r.manufacturer.toLowerCase().includes(search) ||
        r.model.toLowerCase().includes(search) ||
        r.mNumber.toLowerCase().includes(search) ||
        r.serial.toLowerCase().includes(search) ||
        r.notes.toLowerCase().includes(search)
    )
  );

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useAppDispatch();
  const indeterminate =
    items.filter((r) => r.selected).length < items.length &&
    items.filter((r) => r.selected).length > 0;
  const allChecked = items.filter((r) => r.selected).length === items.length;
  const navigate = useNavigate();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function navigateToItem(id: number) {
    navigate(`/inventory/${id}`);
  }

  return (
    <Paper sx={{ marginTop: "2em" }}>
      <TableContainer sx={{ maxHeight: "calc(100vh - 13em)" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                >
                  {column.id === "chk" ? (
                    <Checkbox
                      color="primary"
                      checked={allChecked}
                      inputProps={{
                        "aria-label": "select all items",
                      }}
                      indeterminate={indeterminate}
                      onChange={() => {
                        dispatch(
                          selectItem({
                            selectAll: true,
                          })
                        );
                      }}
                    />
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow
                    role="checkbox"
                    tabIndex={-1}
                    key={`row.serial-${index}`}
                    sx={{ backgroundColor: row.selected ? "#EBF4FF" : "white" }}
                  >
                    {columns.map((column) => {
                      const value = getItemValue(column.id, row);
                      return (
                        <TableCell
                          size="small"
                          key={column.id}
                          align={column.align}
                          className={`${
                            column.id === "chk" ? "" : "ivt-table__pointer"
                          }`}
                          onClick={
                            column.id === "chk"
                              ? () => {}
                              : () => navigateToItem(row.id)
                          }
                        >
                          {column.id === "chk" ? (
                            <Checkbox
                              color="primary"
                              checked={row.selected ?? false}
                              inputProps={{
                                "aria-label": "select item",
                              }}
                              onChange={(event) =>
                                dispatch(
                                  selectItem({
                                    id: row.id,
                                    value: event.target.checked,
                                    selectAll: false,
                                  })
                                )
                              }
                            />
                          ) : column.format && typeof value === "number" ? (
                            column.format(value)
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
