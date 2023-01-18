import { useAppDispatch, useAppSelector } from "../app/hooks";
import { deleteItems } from "../features/data/inventorySlice";
import { deleteDataItem } from "../features/data/dataSlice";
import ConfirmDialog from "../components/ConfirmDialog";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { PrimaryButton } from "../components/PrimaryButton";
import { InventoryTable } from "../components/InventoryTable";
import { SquareButton } from "../components/SquareButton";
import { AddItemDialog } from "../components/AddItemDialog";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CopyIcon from "@mui/icons-material/ContentCopyTwoTone";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { useWindowSize } from "@react-hook/window-size";
import { initialLoad } from "../features/data/dataSlice";
import { ItemRepository } from "../repositories/ItemRepository";
import { openSnack, SnackType } from "../features/data/uiSlice";

export function InventoryPage() {
  const dispatch = useAppDispatch();
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [duplicateOpen, setDuplicateOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<number[]>([]);
  const [addDialog, setAddDialog] = useState<boolean>(false);
  const [width, height] = useWindowSize();
  const items = useAppSelector((state) => state.data.items);

  async function _delete(ids: number[]) {
    const success = await dispatch(deleteItems(ids));

    if (success) {
      for (const id of ids) {
        dispatch(deleteDataItem(id));
      }
    }
  }

  async function _duplicate(ids: number[]) {
    const id = ids[0];

    const success = await ItemRepository.duplicateItem(id);

    if (success) {
      dispatch(initialLoad());
      dispatch(
        openSnack({
          type: SnackType.success,
          message: "Item duplicated successfully.",
        })
      );
    } else {
      dispatch(
        openSnack({
          type: SnackType.error,
          message: "Error duplicating item.",
        })
      );
    }
  }

  return (
    <div className="py-3 px-10 w-full h-[100vh] flex flex-col">
      <ConfirmDialog
        key="duplicate-dialog"
        icon={<CopyIcon className="mr-[8px]" fontSize="small" />}
        title="Duplicate Item"
        body="Are you sure you want to duplicate this item?"
        open={duplicateOpen}
        setOpen={() => setDuplicateOpen(!duplicateOpen)}
        onConfirm={() => _duplicate(selected)}
      />
      <ConfirmDialog
        key="delete-dialog"
        icon={<DeleteIcon className="mr-1" fontSize="small" />}
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
        callback={(success: boolean) => {
          dispatch(
            openSnack({
              type: success ? SnackType.success : SnackType.error,
              message: success
                ? "Item created successfully."
                : "There was an error creating item.",
            })
          );
        }}
      />
      <Header />
      <div className="animate-fade grow flex flex-col">
        <div className="w-full h-15 flex flex-row justify-between mt-10">
          <SearchBar onChange={(v: string) => setSearch(v)} />
          <div className="flex flex-row">
            {selected.length === 0 ? (
              <></>
            ) : (
              <div className="flex flex-row">
                {selected.length === 1 ? (
                  <div className="flex flex-row">
                    <SquareButton
                      key="duplicate-cta"
                      icon={ImageHelper.image(Images.duplicate)}
                      onClick={() => setDuplicateOpen(true)}
                    />
                    <div className="w-3"></div>
                  </div>
                ) : (
                  <></>
                )}
                <SquareButton
                  key="delete-cta"
                  icon={ImageHelper.image(Images.delete)}
                  onClick={() => setDeleteOpen(true)}
                />
              </div>
            )}
            <div className="w-3"></div>
            <PrimaryButton
              icon={ImageHelper.image(Images.addPurple)}
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
          width={width}
          items={items}
        />
      </div>
    </div>
  );
}
