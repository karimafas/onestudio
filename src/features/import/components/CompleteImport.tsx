import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { ImageHelper, Images } from "../../../helpers/ImageHelpers";

export function CompleteImport() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center">
      <img className="w-28 mb-8" src={ImageHelper.image(Images.complete)} />
      <span className="text-light_purple font-semibold text-[30px]">
        You're all set!
      </span>
      <span className="text-light_purple font-base mb-8">
        Your items have been uploaded successfully.
      </span>
      <PrimaryButton
        text="Take me to Inventory"
        onClick={() => navigate("/inventory")}
        icon={ImageHelper.image(Images.inventoryPurple)}
        iconStyle="w-4"
      />
    </div>
  );
}
