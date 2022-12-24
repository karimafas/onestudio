import { Dialog } from "@mui/material";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { PrimaryButton } from "./PrimaryButton";

const ConfirmDialog = (props: {
  title: string;
  body: string;
  icon: any;
  open: boolean;
  setOpen: Function;
  onConfirm: Function;
}) => {
  const { title, body, open, setOpen, onConfirm } = props;
  return (
    <Dialog
      PaperProps={{
        style: { borderRadius: 20, backgroundColor: "white" },
      }}
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
    >
      <div className="p-6">
        <div className="flex flex-row items-center mb-1 text-dark_blue">
          {props.icon}
          <span className="text-lg font-semibold">{title}</span>
        </div>
        <span className="text-dark_blue text-sm font-base">{body}</span>
        <div className="flex flex-row justify-end mt-6">
          <PrimaryButton
            onClick={() => setOpen(false)}
            text="No"
            icon={ImageHelper.image(Images.closePurple)}
            iconStyle="w-3"
          />
          <PrimaryButton
            onClick={() => {
              setOpen(false);
              onConfirm();
            }}
            text="Yes"
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
};
export default ConfirmDialog;
