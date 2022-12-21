import { Dialog } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { initialLoad } from "../features/data/dataSlice";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { Category } from "../objects/Category";
import { ItemDfo, ItemStatus } from "../objects/InventoryItem";
import { StudioLocation } from "../objects/StudioLocation";
import { StudioUser } from "../objects/StudioUser";
import { ItemRepository } from "../repositories/ItemRepository";
import { ValidationObject } from "../services/ValidationService";
import { CustomSelect } from "./CustomSelect";
import { CustomTextField } from "./CustomTextField";
import { PrimaryButton } from "./PrimaryButton";

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
    location_id: "",
    serial: "",
    m_number: "",
    price: "",
    category_id: "",
    owner_id: "",
    notes: "",
    status: ItemStatus.working,
  };
  const [dfo, setDfo] = useState<ItemDfo>(initialDfo);
  const categories: Array<Category> = useAppSelector(
    (state) => state.data.categories
  );
  const locations: Array<StudioLocation> = useAppSelector(
    (state) => state.data.locations
  );
  const owners: Array<StudioUser> = useAppSelector((state) =>
    state.data.studioUsers.filter((u) => u.owner)
  );
  const { open, setOpen } = props;

  const handleSubmit = () => {
    const object: ValidationObject = validationObject.validate({
      dfo: dfo,
      notNull: [
        "manufacturer",
        "model",
        "location_id",
        "serial",
        "m_number",
        "price",
        "category_id",
        "owner_id",
      ],
      number: ["price"],
    });

    if (object.isValid) {
      _createItem(dfo);
    }

    setValidationObject(object);
  };

  async function _createItem(dfo: ItemDfo) {
    const result = await ItemRepository.createItem(dfo);

    if (result.success) {
      dispatch(initialLoad());
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
            <CustomTextField
              width="w-60"
              placeholder="M-Number"
              name="m_number"
              defaultValue={dfo.m_number}
              validationObject={validationObject}
              onChange={(v: string) => setDfo({ ...dfo, m_number: v })}
            />
            <CustomSelect
              width="w-60"
              elements={locations.map((l) => {
                return {
                  id: l.id,
                  value: l.name,
                };
              })}
              placeholder="Location"
              name="location_id"
              defaultValue={dfo.location_id}
              validationObject={validationObject}
              onChange={(v: string) => setDfo({ ...dfo, location_id: v })}
            />
          </div>
          <div className="flex flex-row w-full justify-between">
            <CustomSelect
              width="w-60"
              elements={categories.map((c) => {
                return {
                  id: c.id,
                  value: c.name,
                };
              })}
              placeholder="Category"
              name="category_id"
              defaultValue={dfo.category_id}
              validationObject={validationObject}
              onChange={(v: string) => {
                setDfo({ ...dfo, category_id: v });
              }}
            />
            <CustomSelect
              width="w-60"
              elements={owners.map((o) => {
                return {
                  id: o.id,
                  value: `${o.firstName} ${o.lastName}`,
                };
              })}
              placeholder="Owner"
              name="owner_id"
              defaultValue={dfo.owner_id}
              validationObject={validationObject}
              onChange={(v: string) => setDfo({ ...dfo, owner_id: v })}
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
