import { Dialog } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { CustomTextField } from "../../../components/CustomTextField";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { ImageHelper, Images } from "../../../helpers/ImageHelpers";
import { getLastUserActivity } from "../../../reducers/dataSlice";
import { openSnack, SnackType } from "../../../reducers/uiSlice";
import { InvitationRepository } from "../../../repositories/InvitationRepository";
import { ValidationObject } from "../../../services/ValidationService";

interface InviteDfo {
  email: string;
}

const InviteUserDialog = (props: { open: boolean; setOpen: Function }) => {
  const { open, setOpen } = props;
  const dispatch = useAppDispatch();
  const userEmails = useAppSelector((state) => state.data.studioUsers).map(
    (u) => u.email
  );
  const [dfo, setDfo] = useState<InviteDfo>({ email: "" });
  const [validationObject, setValidationObject] = useState<ValidationObject>(
    ValidationObject.empty()
  );

  async function _confirm() {
    const object = validationObject.validate({
      dfo: dfo,
      notNull: ["email"],
      number: [],
    });
    setValidationObject(object);
    if (!object.isValid) return;

    await InvitationRepository.sendInvitation(dfo.email);
    setOpen(false);
    setDfo({ email: "" });
    dispatch(getLastUserActivity());
    dispatch(
      openSnack({
        message: "User invited successfully.",
        type: SnackType.success,
      })
    );
  }

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
        <div className="flex flex-row items-center text-dark_blue mb-2">
          <img className="h-6 mr-3" src={ImageHelper.image(Images.users)} />
          <span className="text-lg font-semibold">Invite a user</span>
        </div>
        <span className="text-dark_blue font-medium text-sm">
          We'll email them with steps on how to join the team.
        </span>
        <CustomTextField
          placeholder="Email address"
          onChange={(v: string) => setDfo({ email: v })}
          validationObject={validationObject}
          width="w-full"
          style="mt-3"
          name="email"
        />
        <div className="flex flex-row justify-end mt-6">
          <PrimaryButton
            onClick={() => setOpen(false)}
            text="Cancel"
            icon={ImageHelper.image(Images.closePurple)}
            iconStyle="w-3"
          />
          <PrimaryButton
            onClick={_confirm}
            text="Send invite"
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
export default InviteUserDialog;
