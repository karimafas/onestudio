import { Dialog } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { CustomSelect } from "../../../components/CustomSelect";
import { CustomTextField } from "../../../components/CustomTextField";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { ImageHelper, Images } from "../../../helpers/ImageHelpers";
import { Category } from "../../../objects/Category";
import { ItemDfo } from "../../../objects/InventoryItem";
import { StudioLocation } from "../../../objects/StudioLocation";
import { StudioUser } from "../../../objects/StudioUser";
import { createItem, getLastUserActivity } from "../../../reducers/dataSlice";
import { ValidationObject } from "../../../services/ValidationService";

export function AddItemDialog(props: {
  open: boolean;
  setOpen: Function;
  callback: Function;
}) {
  const dispatch = useAppDispatch();
  const [validationObject, setValidationObject] = useState<ValidationObject>(
    ValidationObject.empty()
  );
  const initialDfo: ItemDfo = {
    manufacturer: "",
    model: "",
    locationId: "",
    serial: "",
    price: "",
    categoryId: "",
    ownerId: "",
    notes: "",
  };
  const [dfo, setDfo] = useState<ItemDfo>(initialDfo);
  const categories: Category[] = useAppSelector(
    (state) => state.data.categories
  );
  const locations: StudioLocation[] = useAppSelector(
    (state) => state.data.locations
  );
  const owners: StudioUser[] = useAppSelector((state) =>
    state.data.studioUsers.filter((u) => u.owner)
  );
  const { open, setOpen } = props;

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
      _createItem(dfo);
    }

    setValidationObject(object);
  };

  async function _createItem(dfo: ItemDfo) {
    const result = await dispatch(createItem(dfo)).unwrap();

    if (result.success) {
      dispatch(getLastUserActivity());
      props.callback(true);
      setDfo(initialDfo);
    } else {
      props.callback(false);
    }
    props.setOpen(false);
  }

  return (
    <Dialog
      PaperProps={{
        style: {
          borderRadius: 10,
          backgroundColor: "white",
          overflow: "hidden",
        },
      }}
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
    >
      <div className="p-6">
        <div className="flex flex-row items-center mb-1 text-dark_blue">
          <img className="w-5 mr-2" src={ImageHelper.image(Images.addBlue)} />
          <span className="text-lg font-semibold">Add an item</span>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-row mt-4 w-full justify-between">
            <CustomTextField
              width="w-60"
              style="mr-4"
              placeholder="Manufacturer"
              name="manufacturer"
              defaultValue={dfo.manufacturer}
              validationObject={validationObject}
              onChange={(v: string) => setDfo({ ...dfo, manufacturer: v })}
            />
            <CustomTextField
              width="w-60"
              placeholder="Model"
              name="model"
              defaultValue={dfo.model}
              validationObject={validationObject}
              onChange={(v: string) => setDfo({ ...dfo, model: v })}
            />
          </div>
          <div className="flex flex-row w-full justify-between">
            <CustomTextField
              width="w-60"
              placeholder="Price"
              name="price"
              defaultValue={dfo.price}
              validationObject={validationObject}
              onChange={(v: string) => setDfo({ ...dfo, price: v })}
            />
            <CustomTextField
              width="w-60"
              placeholder="Serial"
              name="serial"
              defaultValue={dfo.serial}
              validationObject={validationObject}
              onChange={(v: string) => setDfo({ ...dfo, serial: v })}
            />
          </div>
          <div className="flex flex-row w-full justify-between">
            <CustomSelect
              width="w-60"
              elements={locations.map((l) => {
                return {
                  id: l.id,
                  value: l.name,
                };
              })}
              placeholder="Location"
              name="locationId"
              defaultValue={dfo.locationId}
              validationObject={validationObject}
              onChange={(v: string) => setDfo({ ...dfo, locationId: v })}
            />
            <CustomSelect
              width="w-60"
              elements={categories.map((c) => {
                return {
                  id: c.id,
                  value: c.name,
                };
              })}
              placeholder="Category"
              name="categoryId"
              defaultValue={dfo.categoryId}
              validationObject={validationObject}
              onChange={(v: string) => {
                setDfo({ ...dfo, categoryId: v });
              }}
            />
          </div>
          <div className="flex flex-row w-full justify-between">
            <CustomSelect
              width="w-60"
              elements={owners.map((o) => {
                return {
                  id: o.id,
                  value: `${o.firstName} ${o.lastName}`,
                };
              })}
              placeholder="Owner"
              name="ownerId"
              defaultValue={dfo.ownerId}
              validationObject={validationObject}
              onChange={(v: string) => setDfo({ ...dfo, ownerId: v })}
            />
          </div>
          <CustomTextField
            width="w-[100%]"
            placeholder="Notes"
            name="notes"
            defaultValue={dfo.notes}
            validationObject={validationObject}
            onChange={(v: string) => setDfo({ ...dfo, notes: v })}
          />
        </div>
        <div className="flex flex-row justify-end mt-6">
          <PrimaryButton
            onClick={() => setOpen(false)}
            text="Cancel"
            icon={ImageHelper.image(Images.closePurple)}
            iconStyle="w-3"
          />
          <PrimaryButton
            onClick={handleSubmit}
            text="Add item"
            backgroundColor="bg-blue_100"
            textColor="text-white"
            icon={ImageHelper.image(Images.check)}
            iconStyle="w-4"
            style="ml-4"
          />
        </div>
      </div>
    </Dialog>
  );
}
