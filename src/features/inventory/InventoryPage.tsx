import CopyIcon from "@mui/icons-material/ContentCopyTwoTone";
import DeleteIcon from "@mui/icons-material/Delete";
import { useWindowSize } from "@react-hook/window-size";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AppTable } from "../../components/AppTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import { FilterButton } from "../../components/FilterButton";
import { FilterSection } from "../../components/FilterSection";
import { Header } from "../../components/Header";
import { PrimaryButton } from "../../components/PrimaryButton";
import { SearchBar } from "../../components/SearchBar";
import { SquareButton } from "../../components/SquareButton";
import { AppConstants } from "../../config/AppConstants";
import { ImageHelper, Images } from "../../helpers/ImageHelpers";
import { TableItem } from "../../objects/TableItem";
import {
  deleteDataItem,
  duplicateItem,
  getLastUserActivity,
} from "../../reducers/dataSlice";
import { openSnack, SnackType } from "../../reducers/uiSlice";
import { ItemRepository } from "../../repositories/ItemRepository";
import { FilterService } from "../../services/FilterService";
import { AddItemDialog } from "./components/AddItemDialog";

export function InventoryPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterState = useAppSelector((state) => state.filter);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [duplicateOpen, setDuplicateOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<number[]>([]);
  const [addDialog, setAddDialog] = useState<boolean>(false);
  const [width, height] = useWindowSize();
  const items = useAppSelector((state) => state.data.items);
  const [page, setPage] = useState<number>(0);
  const itemsPerPage = Math.round(height / 175);
  const searchedItems = items.filter(
    (i) =>
      i.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
      i.model.toLowerCase().includes(search.toLowerCase()) ||
      i.price.toString().toLowerCase().includes(search.toLowerCase()) ||
      i.serial.toLowerCase().includes(search.toLowerCase()) ||
      i.notes.toLowerCase().includes(search.toLowerCase())
  );
  const processedItems = FilterService.filter(filterState, searchedItems);
  const filteredItems = processedItems.slice(
    page * itemsPerPage,
    itemsPerPage * (page + 1)
  );
  const totalPages = Math.ceil(processedItems.length / itemsPerPage);

  useEffect(() => {
    const createItem = searchParams.get("createItem");
    if (createItem)
      setTimeout(() => {
        setAddDialog(true);
      }, 200);
  }, []);

  async function _delete(ids: number[]) {
    const success = await ItemRepository.deleteItems(ids);

    if (success) {
      for (const id of ids) {
        dispatch(deleteDataItem(id));
      }

      setSelected([]);
    }
  }

  async function _duplicate(ids: number[]) {
    const id = ids[0];
    const result = await dispatch(duplicateItem(id)).unwrap();
    if (result.success) return dispatch(getLastUserActivity());
    dispatch(
      openSnack({
        type: SnackType.error,
        message: "Error duplicating item.",
      })
    );
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
              iconStyle='w-5'
              text="Add an item"
              onClick={() => setAddDialog(true)}
              style="mr-3"
            />
            <SquareButton
              icon={ImageHelper.image(Images.upload)}
              onClick={() => navigate("/import")}
            />
            <FilterButton />
          </div>
        </div>
        <FilterSection items={searchedItems} />
        <AppTable
          itemsPerPage={Math.round(height / 175)}
          selected={selected}
          setSelected={setSelected}
          searchQuery={search}
          width={width}
          items={items.map((i) => TableItem.fromInventoryItem(i))}
          filteredItems={filteredItems.map((i) =>
            TableItem.fromInventoryItem(i)
          )}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          addItemCallback={() => setAddDialog(true)}
          columns={
            width > 1070
              ? AppConstants.tableColumns
              : AppConstants.tableColumns.filter((c) => c.priority === 0)
          }
        />
      </div>
    </div>
  );
}
