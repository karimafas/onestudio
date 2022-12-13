import { Button, Drawer, Snackbar } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { createItem, setDrawer } from "../features/data/inventorySlice";
import React, { useEffect, useState } from "react";
import { ItemDrawer, SubmittedData } from "../components/ItemDrawer";
import { deleteItems } from "../features/data/inventorySlice";
import { deleteDataItem, initialLoad } from "../features/data/dataSlice";
import ConfirmDialog from "../components/ConfirmDialog";
import { InventoryItem, ItemStatus } from "../objects/InventoryItem";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { PrimaryButton } from "../components/PrimaryButton";
import { InventoryTable } from "../components/InventoryTable";
import { SquareButton } from "../components/SquareButton";

export function InventoryPage() {
  const navigate = useNavigate();
  const drawer = useAppSelector((state) => state.inventory.drawer);
  const searchValue = useAppSelector((state) => state.inventory.search);
  const dispatch = useAppDispatch();
  const [isDesktop, setDesktop] = useState(window.innerWidth > 700);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackId, setSnackId] = useState<any>(null);
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<number[]>([]);

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

      setSelected([]);
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
      ItemStatus.working,
      0
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
    <div className="py-3 px-10 w-full h-[100vh] flex flex-col">
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
        body={`Are you sure you want to delete ${selected.length} item${
          selected.length > 1 ? "s" : ""
        }?`}
        open={deleteOpen}
        setOpen={() => setDeleteOpen(!deleteOpen)}
        onConfirm={() => _delete(selected)}
      />
      <React.Fragment key="right">
        <Drawer
          transitionDuration={300}
          anchor="right"
          open={drawer}
          onClose={() => dispatch(setDrawer(false))}
        >
          <ItemDrawer submit={(data: SubmittedData) => _create(data)} />
        </Drawer>
      </React.Fragment>
      <Header />
      <div className="animate-fade grow flex flex-col">
        <div className="w-full h-15 flex flex-row justify-between mt-6">
          <SearchBar onChange={(v: string) => setSearch(v)} />
          <div className="flex flex-row">
            {selected.length === 0 ? (
              <></>
            ) : (
              <SquareButton
                icon={require("../assets/images/delete.png")}
                onClick={() => setDeleteOpen(true)}
              />
            )}
            <div className="w-3"></div>
            <PrimaryButton onClick={() => dispatch(setDrawer(true))} />
          </div>
        </div>
        <InventoryTable
          selected={selected}
          setSelected={setSelected}
          searchQuery={search}
        />
      </div>
    </div>
  );
}
