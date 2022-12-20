import { Button, Snackbar } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { deleteItems } from "../features/data/inventorySlice";
import { deleteDataItem } from "../features/data/dataSlice";
import ConfirmDialog from "../components/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { PrimaryButton } from "../components/PrimaryButton";
import { InventoryTable } from "../components/InventoryTable";
import { SquareButton } from "../components/SquareButton";
import { AddItemDialog } from "../components/AddItemDialog";
import { useEffect, useState } from "react";
import {
  CustomSnackBar,
  SnackState,
  SnackType,
} from "../components/CustomSnackBar";

export function InventoryPage() {
  const navigate = useNavigate();
  const drawer = useAppSelector((state) => state.inventory.drawer);
  const dispatch = useAppDispatch();
  const [height, setHeight] = useState(window.innerHeight);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackId, setSnackId] = useState<any>(null);
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<number[]>([]);
  const [addDialog, setAddDialog] = useState<boolean>(false);
  const [createSnack, setCreateSnack] = useState<SnackState>({
    open: false,
    type: SnackType.createSuccess,
  });

  const updateMedia = () => {
    setHeight(window.innerHeight);
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

  return (
    <div>
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
        <AddItemDialog
          open={addDialog}
          setOpen={setAddDialog}
          callback={(success: boolean) =>
            setCreateSnack({
              open: true,
              type: success ? SnackType.createSuccess : SnackType.createError,
            })
          }
        />
        <Header />
        <div className="animate-fade grow flex flex-col">
          <div className="w-full h-15 flex flex-row justify-between mt-10">
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
              <PrimaryButton
                icon={require("../assets/images/add-purple.png")}
                text="Add an item"
                onClick={() => setAddDialog(true)}
              />
            </div>
          </div>
          <InventoryTable
            itemsPerPage={Math.round(height / 175)}
            selected={selected}
            setSelected={setSelected}
            searchQuery={search}
          />
        </div>
      </div>
      <CustomSnackBar
        state={createSnack}
        handleClose={() => setCreateSnack({ ...createSnack, open: false })}
      />
    </div>
  );
}
