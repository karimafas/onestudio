import { Dialog } from "@mui/material";
import { useState } from "react";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { ValidationObject } from "../services/ValidationService";
import { CustomTextField } from "./CustomTextField";
import { PrimaryButton } from "./PrimaryButton";

export enum TypesDialogType {
  category = "category",
  location = "location",
  status = "status",
}

export function AddTypesDialog(props: {
  open: boolean;
  setOpen: Function;
  callback: Function;
  type: TypesDialogType;
}) {
  const { open, setOpen, callback, type } = props;
  const [name, setName] = useState<string>("");
  const [validationObject, setValidationObject] = useState<ValidationObject>(
    ValidationObject.empty()
  );

  function title() {
    return `Create a ${type}`;
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
          <span className="text-lg font-semibold">{title()}</span>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-row mt-4 w-full justify-between">
            <CustomTextField
              width="w-[25rem]"
              style="mr-4"
              placeholder="Name"
              name="name"
              defaultValue={name}
              validationObject={validationObject}
              onChange={(v: string) => {
                setName(v);
              }}
            />
          </div>
        </div>
        <div className="flex flex-row justify-end mt-6">
          <PrimaryButton
            onClick={() => setOpen(false)}
            text="Cancel"
            icon={ImageHelper.image(Images.closePurple)}
            iconStyle="w-3"
          />
          <PrimaryButton
            onClick={() => {
              const object = validationObject.validate({
                dfo: { name: name },
                notNull: ["name"],
                number: [],
              });
              setValidationObject(object);
              if (!object.isValid) return;

              callback({ name });
              setName("");
            }}
            text="Add"
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
