import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  changeStatus,
  deleteDataItem,
  getLastUserActivity,
  loadItemComments,
  reloadItem,
  updateItem,
} from "../features/data/dataSlice";
import { ItemDfo } from "../objects/InventoryItem";
import { Header } from "../components/Header";
import { PrimaryButton } from "../components/PrimaryButton";
import { SquareButton } from "../components/SquareButton";
import { ValidationObject } from "../services/ValidationService";
import ConfirmDialog from "../components/ConfirmDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { openSnack, SnackType } from "../features/data/uiSlice";
import { Status } from "../objects/Status";
import { StringHelper } from "../helpers/StringHelper";
import { ItemForm } from "../components/ItemForm";
import { CommentSection } from "../components/CommentSection";
import { StatusSelect } from "../components/StatusSelect";
import { ItemRepository } from "../repositories/ItemRepository";
import { CustomSelect } from "../components/CustomSelect";

function useForceUpdate() {
  const [_, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

export function ItemPage() {
  const forceUpdate = useForceUpdate();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  const id = parseInt(params["id"] ?? "0");
  const item = useAppSelector(
    (state) => state.data.items.filter((i) => i.id === id)[0]
  );
  const [disabled, setDisabled] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const statuses: Status[] = useAppSelector((state) => state.data.statuses);
  const [validationObject, setValidationObject] = useState<ValidationObject>(
    ValidationObject.empty()
  );
  const [initialState, setInitialState] = useState<ItemDfo>({
    id: item.id,
    manufacturer: item.manufacturer,
    model: item.model,
    locationId: item.locationId + "",
    serial: item.serial,
    price: item.price + "",
    categoryId: item.categoryId + "",
    ownerId: item.ownerId + "",
    notes: item.notes,
  });
  const [dfo, setDfo] = useState<ItemDfo>(initialState);
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const owners = useAppSelector((state) => state.data.studioUsers);

  useEffect(() => {
    dispatch(loadItemComments(item));
    scrollToComments();
  }, [item.id]);

  function scrollToComments() {
    if (!searchParams.get("comments")) return;
    setTimeout(() => {
      const section = document.querySelector("#comments");
      section!.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 200);
  }

  function hasChanged() {
    console.log("initial", JSON.stringify(initialState));
    console.log("changed", JSON.stringify(dfo));
    return JSON.stringify(initialState) !== JSON.stringify(dfo);
  }

  async function _updateItem(data: ItemDfo) {
    if (!hasChanged()) setDisabled(true);

    const result = await dispatch(updateItem({ dfo })).unwrap();
    if (result.success) {
      dispatch(
        openSnack({
          type: SnackType.success,
          message: "Item was updated successfully.",
        })
      );
      dispatch(getLastUserActivity());
      setInitialState(dfo);
    } else {
      dispatch(
        openSnack({
          type: SnackType.error,
          message: "There was an error updating item.",
        })
      );
    }

    setDisabled(false);
  }

  async function _updateStatus(newStatusId: number) {
    const result = await dispatch(
      changeStatus({ statusId: newStatusId, itemId: item.id })
    ).unwrap();

    if (!result.success) {
      return dispatch(
        openSnack({
          type: SnackType.error,
          message: "Error updating item status.",
        })
      );
    }

    dispatch(getLastUserActivity());
  }

  async function _delete() {
    const success = await ItemRepository.deleteItems([id]);
    if (success) {
      dispatch(deleteDataItem(id));
      navigate("/inventory");
    }
  }

  const handleSubmit = () => {
    const object: ValidationObject = validationObject.validate({
      dfo: dfo,
      notNull: [
        "manufacturer",
        "model",
        "locationId",
        "serial",
        "price",
        "categoryId",
        "ownerId",
      ],
      number: ["price"],
    });

    if (object.isValid) {
      _updateItem(dfo);
    }

    setValidationObject(object);
  };

  if (!item) {
    return <div></div>;
  } else {
    return (
      <div className="py-3 px-10 w-full h-screen overflow-auto">
        <ConfirmDialog
          icon={<DeleteIcon className="mr-1" fontSize="small" />}
          title="Delete Item"
          body="Are you sure you want to delete this item?"
          open={deleteOpen}
          setOpen={() => setDeleteOpen(!deleteOpen)}
          onConfirm={_delete}
        />
        <ConfirmDialog
          icon={<DeleteIcon className="mr-1" fontSize="small" />}
          title="Unsaved Changes"
          body="Are you sure you want to go back? All changes will be lost."
          open={confirmDialog}
          setOpen={() => setConfirmDialog(!confirmDialog)}
          onConfirm={() => navigate("/inventory")}
        />
        <Header />
        <div className="flex flex-row w-full h-full animate-fade pt-8">
          <div className="w-1/2">
            <div
              onClick={() => {
                if (hasChanged()) {
                  setConfirmDialog(true);
                } else {
                  navigate("/inventory");
                }
              }}
              className="w-48 flex flex-row ml-1 items-center cursor-pointer mb-6"
            >
              <img
                className="h-[8.5px] mr-3"
                src={ImageHelper.image(Images.backBlue)}
              />
              <span className="font-semibold text-light_purple text-sm">
                Back to inventory
              </span>
            </div>
            <ItemForm
              disabled={disabled}
              validationObject={validationObject}
              setDfo={setDfo}
              dfo={dfo}
            />
            <div className="w-[30em] mt-10" id="comments">
              <span className="text-dark_blue text-sm font-semibold">
                Activity
              </span>
              <CommentSection item={item} />
            </div>
          </div>
          <div className="w-1/2 flex flex-col items-end">
            <div className="flex flex-row justify-end w-[10em]">
              <SquareButton
                icon={ImageHelper.image(Images.delete)}
                onClick={() => setDeleteOpen(true)}
              />
              <PrimaryButton
                style="ml-4"
                icon={ImageHelper.image(Images.save)}
                text="Save"
                onClick={() => handleSubmit()}
              />
            </div>
            <StatusSelect
              style="mt-5 w-[10em]"
              onChange={(e: string) => _updateStatus(parseInt(e))}
              itemId={item.id}
              elements={statuses.map((s) => {
                return {
                  id: s.id,
                  value: StringHelper.toFirstUpperCase(s.name),
                };
              })}
            />
            <CustomSelect
              variant="filled"
              style="w-[10em] mt-1"
              elements={owners.map((o) => {
                return {
                  id: o.id,
                  value: `${o.firstName} ${o.lastName}`,
                };
              })}
              disabled={disabled}
              validationObject={validationObject}
              defaultValue={`${dfo.ownerId}`}
              name="ownerId"
              onChange={(v: string) => {
                setDfo({ ...dfo, ownerId: v });
              }}
              key={`owner-${dfo.ownerId}`}
            />
          </div>
        </div>
      </div>
    );
  }
}
