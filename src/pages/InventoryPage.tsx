import InventoryTable from "../components/InventoryTable";
import "./InventoryPage.css";
import BentoIcon from "@mui/icons-material/Bento";
import { Button, Drawer, IconButton, Snackbar, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { createItem, search, setDrawer } from "../features/data/inventorySlice";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { AddDrawer, SubmittedData } from "../components/AddDrawer";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteItems } from "../features/data/inventorySlice";
import { deleteDataItem, initialLoad } from "../features/data/dataSlice";
import ConfirmDialog from "../components/ConfirmDialog";
import { InventoryItem, ItemStatus } from "../objects/InventoryItem";
import { useNavigate } from "react-router-dom";

export function InventoryPage() {
  const navigate = useNavigate();
  const drawer = useAppSelector((state) => state.inventory.drawer);
  const searchValue = useAppSelector((state) => state.inventory.search);
  const dispatch = useAppDispatch();
  const [isDesktop, setDesktop] = useState(window.innerWidth > 700);
  const selectedItems = useAppSelector((state) =>
    state.data.items.filter((i) => i.selected)
  );
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackId, setSnackId] = useState<any>(null);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 700);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  async function _delete(ids: Array<number>) {
    const success = await dispatch(deleteItems(ids));

    if (success) {
      for (const id of ids) {
        dispatch(deleteDataItem(id));
      }
    }
  }

  async function _create(data: SubmittedData) {
    const item: InventoryItem = new InventoryItem(
      0,
      data.manufacturer,
      data.model,
      parseInt(data.locationId),
      data.serial,
      data.mNumber,
      parseFloat(data.price),
      parseInt(data.categoryId),
      parseInt(data.ownerId),
      data.notes,
      new Date(),
      new Date(),
      ItemStatus.working
    );

    const result = await dispatch(createItem(item));

    if ((result.payload as { success: boolean; id: any }).success) {
      dispatch(setDrawer(false));
      setSnackOpen(true);
      setSnackId((result.payload as { success: boolean; id: any }).id);
      dispatch(initialLoad());
    }
  }

  return (
    <div className="inventory-page__wrapper">
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        message="Item created successfully."
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => navigate(`/inventory/${snackId}`)}
          >
            View
          </Button>
        }
        sx={{ bottom: { xs: 90, sm: 0 }, marginBottom: "1em" }}
      />
      <ConfirmDialog
        title="Delete Item"
        body={`Are you sure you want to delete ${selectedItems.length} item${
          selectedItems.length > 1 ? "s" : ""
        }?`}
        open={deleteOpen}
        setOpen={() => setDeleteOpen(!deleteOpen)}
        onConfirm={() => _delete(selectedItems.map((i) => i.id))}
      />
      <React.Fragment key="right">
        <Drawer
          transitionDuration={300}
          anchor="right"
          open={drawer}
          onClose={() => dispatch(setDrawer(false))}
        >
          <AddDrawer submit={(data: SubmittedData) => _create(data)} />
        </Drawer>
      </React.Fragment>
      <div className="inventory-page__row">
        <div className="inventory-page__title-row">
          <BentoIcon fontSize="medium" />
          <span className="inventory-page__title">Inventory</span>
        </div>
        <div className="inventory-page__title-row">
          {isDesktop ? (
            <TextField
              value={searchValue}
              label="Search..."
              size="small"
              className="inventory-page__input"
              onChange={(event) => dispatch(search(event.target.value))}
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => dispatch(search(""))}
                  >
                    <CloseIcon />
                  </IconButton>
                ),
              }}
            />
          ) : (
            <div></div>
          )}
        </div>
        <div className="inventory-page__title-row inventory-page__title-row--end">
          {selectedItems.length > 0 ? (
            <div>
              <IconButton
                aria-label="delete"
                size="medium"
                sx={{ marginRight: "1em" }}
                color="error"
                onClick={() => setDeleteOpen(true)}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </div>
          ) : (
            <div></div>
          )}
          <Button variant="contained" onClick={() => dispatch(setDrawer(true))}>
            Add new item +
          </Button>
        </div>
      </div>
      <InventoryTable />
    </div>
  );
}
