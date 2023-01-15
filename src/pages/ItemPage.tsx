import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { deleteDataItem, reloadItem } from "../features/data/dataSlice";
import { deleteItems, updateItem } from "../features/data/inventorySlice";
import { ItemDfo } from "../objects/InventoryItem";
import { Category } from "../objects/Category";
import { StudioLocation } from "../objects/StudioLocation";
import { StudioUser } from "../objects/StudioUser";
import { Header } from "../components/Header";
import { CustomTextField } from "../components/CustomTextField";
import { PrimaryButton } from "../components/PrimaryButton";
import { SquareButton } from "../components/SquareButton";
import { ValidationObject } from "../services/ValidationService";
import ConfirmDialog from "../components/ConfirmDialog";
import { CustomSelect } from "../components/CustomSelect";
import DeleteIcon from "@mui/icons-material/Delete";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { openSnack, SnackType } from "../features/data/uiSlice";
import { Status } from "../objects/Status";
import { StringHelper } from "../helpers/StringHelper";
import { StatusRepository } from "../repositories/StatusRepository";

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
  const categories: Category[] = useAppSelector(
    (state) => state.data.categories
  );
  const locations: StudioLocation[] = useAppSelector(
    (state) => state.data.locations
  );
  const owners: StudioUser[] = useAppSelector((state) =>
    state.data.studioUsers.filter((u) => u.owner)
  );
  const statuses: Status[] = useAppSelector((state) => state.data.statuses);
  const [validationObject, setValidationObject] = useState<ValidationObject>(
    ValidationObject.empty()
  );
  const initialState: ItemDfo = {
    id: item.id,
    manufacturer: item.manufacturer,
    model: item.model,
    locationId: item.locationId + "",
    serial: item.serial,
    mNumber: item.mNumber,
    price: item.price + "",
    categoryId: item.categoryId + "",
    ownerId: item.ownerId + "",
    notes: item.notes,
  };
  const [dfo, setDfo] = useState<ItemDfo>(initialState);
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false);

  function hasChanged() {
    return JSON.stringify(initialState) !== JSON.stringify(dfo);
  }

  async function _updateItem(data: ItemDfo) {
    if (!hasChanged()) setDisabled(true);

    const result = await dispatch(updateItem(data));
    if (result.payload) {
      await dispatch(reloadItem(item.id));
      await item.initEvents();
      forceUpdate();
      dispatch(
        openSnack({
          type: SnackType.success,
          message: "Item was updated successfully.",
        })
      );
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
    const success = await StatusRepository.changeStatus(newStatusId, item.id);

    if (!success) {
      dispatch(
        openSnack({
          type: SnackType.error,
          message: "Error updating item status.",
        })
      );
    }
  }

  async function _delete() {
    const success = await dispatch(deleteItems([id]));
    if (success.payload) {
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
        "mNumber",
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
      <div className="py-3 px-10 w-full h-[100vh]">
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
        {/* <FaultFixModal
          open={faultFixModal}
          setOpen={setFaultFixModal}
          callback={_createEvent}
          type={
            item.status === ItemStatus.working
              ? FaultFixModalType.fault
              : FaultFixModalType.fix
          }
        /> */}
        <Header />
        <div className="flex flex-col w-full h-[85vh] animate-fade">
          <div className="w-full flex flex-row justify-between mt-6 items-start">
            <div
              onClick={() => {
                if (hasChanged()) {
                  setConfirmDialog(true);
                } else {
                  navigate("/inventory");
                }
              }}
              className="w-48 flex flex-row ml-1 items-center cursor-pointer mt-3"
            >
              <img
                className="h-[8.5px] mr-3"
                src={ImageHelper.image(Images.backBlue)}
              />
              <span className="font-semibold text-light_purple text-sm">
                Back to inventory
              </span>
            </div>
            <div>
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
              <CustomSelect
                style="mt-3 w-[10em]"
                variant="filled"
                disableTyping
                onChange={(e: string) => _updateStatus(parseInt(e))}
                defaultValue={item.status.id + ""}
                elements={statuses.map((s) => {
                  return {
                    id: s.id,
                    value: StringHelper.toFirstUpperCase(s.name),
                  };
                })}
                validationObject={ValidationObject.empty()}
                centerText
              />
            </div>
          </div>
          <div className="flex flex-row h-full justify-between">
            <div className="flex flex-col h-full">
              <CustomTextField
                placeholder="Manufacturer"
                disabled={disabled}
                validationObject={validationObject}
                fontSize="text-xl"
                height="h-10"
                defaultValue={dfo.manufacturer}
                name="manufacturer"
                onChange={(v: string) => setDfo({ ...dfo, manufacturer: v })}
              />
              <CustomTextField
                placeholder="Model"
                disabled={disabled}
                validationObject={validationObject}
                fontSize="text-lg"
                defaultValue={dfo.model}
                name="model"
                onChange={(v: string) => setDfo({ ...dfo, model: v })}
              />
              <div className="w-80 mt-4">
                <div className="flex flex-row justify-between items-start">
                  <span className="text-light_blue font-semibold ml-1 mt-[5px]">
                    Price
                  </span>
                  <CustomTextField
                    disabled={disabled}
                    validationObject={validationObject}
                    defaultValue={dfo.price}
                    name="price"
                    onChange={(v: string) => setDfo({ ...dfo, price: v })}
                    prefix="£"
                  />
                </div>
                <div className="flex flex-row justify-between items-start">
                  <span className="text-light_blue font-semibold ml-1 mt-[5px]">
                    Serial
                  </span>
                  <CustomTextField
                    disabled={disabled}
                    validationObject={validationObject}
                    defaultValue={`${dfo.serial}`}
                    name="serial"
                    onChange={(v: string) => setDfo({ ...dfo, serial: v })}
                  />
                </div>
                <div className="flex flex-row justify-between items-start">
                  <span className="text-light_blue font-semibold ml-1 mt-[5px]">
                    M-Number
                  </span>
                  <CustomTextField
                    disabled={disabled}
                    validationObject={validationObject}
                    defaultValue={`${dfo.mNumber}`}
                    name="mNumber"
                    onChange={(v: string) => setDfo({ ...dfo, mNumber: v })}
                  />
                </div>
                <div className="flex flex-row justify-between items-start">
                  <span className="text-light_blue font-semibold ml-1 mt-[5px]">
                    Notes
                  </span>
                  <CustomTextField
                    disabled={disabled}
                    validationObject={validationObject}
                    name="notes"
                    defaultValue={`${dfo.notes}`}
                    onChange={(v: string) => setDfo({ ...dfo, notes: v })}
                  />
                </div>
              </div>
              <div className="w-80 mt-4">
                <div className="flex flex-row justify-between items-start">
                  <span className="text-light_blue font-semibold ml-1 mt-[5px]">
                    Location
                  </span>
                  <CustomSelect
                    elements={locations.map((l) => {
                      return {
                        id: l.id,
                        value: l.name,
                      };
                    })}
                    disabled={disabled}
                    validationObject={validationObject}
                    defaultValue={`${dfo.locationId}`}
                    name="locationId"
                    onChange={(v: string) => {
                      setDfo({ ...dfo, locationId: v });
                    }}
                    key={`location-${dfo.locationId}`}
                  />
                </div>
                <div className="flex flex-row justify-between items-start">
                  <span className="text-light_blue font-semibold ml-1 mt-[5px]">
                    Category
                  </span>
                  <CustomSelect
                    elements={categories.map((c) => {
                      return {
                        id: c.id,
                        value: c.name,
                      };
                    })}
                    disabled={disabled}
                    validationObject={validationObject}
                    defaultValue={`${dfo.categoryId}`}
                    name="categoryId"
                    onChange={(v: string) => {
                      setDfo({ ...dfo, categoryId: v });
                    }}
                    key={`category-${dfo.categoryId}`}
                  />
                </div>
                <div className="flex flex-row justify-between items-start">
                  <span className="text-light_blue font-semibold ml-1 mt-[5px]">
                    Owner
                  </span>
                  <CustomSelect
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
          </div>
        </div>
      </div>
    );
  }
}
