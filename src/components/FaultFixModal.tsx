import { Dialog } from "@mui/material";
import { useState } from "react";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { ValidationObject } from "../services/ValidationService";
import { CustomTextField } from "./CustomTextField";
import { PrimaryButton } from "./PrimaryButton";

export enum FaultFixModalType {
  fix,
  fault,
}

export function FaultFixModal(props: {
  open: boolean;
  setOpen: Function;
  callback: Function;
  type: FaultFixModalType;
}) {
  const { open, setOpen, callback, type } = props;
  const [notes, setNotes] = useState<string>("");
  const [validationObject, setValidationObject] = useState<ValidationObject>(
    ValidationObject.empty()
  );

  function title() {
    switch (type) {
      case FaultFixModalType.fix:
        return "Report a fix";
      default:
        return "Report a fault";
    }
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
          <img
            className="w-5 mr-2"
            src={
              type === FaultFixModalType.fix
                ? ImageHelper.image(Images.fixBlue)
                : ImageHelper.image(Images.faultBlue)
            }
          />
          <span className="text-lg font-semibold">{title()}</span>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-row mt-4 w-full justify-between">
            <CustomTextField
              width="w-[25rem]"
              style="mr-4"
              placeholder="Notes"
              name="notes"
              defaultValue={notes}
              validationObject={validationObject}
              onChange={(v: string) => {
                setNotes(v);
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
              callback(notes);
              setNotes("");
            }}
            text="Report"
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
