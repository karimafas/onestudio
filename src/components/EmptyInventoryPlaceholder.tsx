import { ImageHelper, Images } from "../helpers/ImageHelpers";
import { PrimaryButton } from "./PrimaryButton";

export function EmptyInventoryPlaceholder(props: {
  addItemCallback: Function;
}) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <img className="w-[50%]" src={ImageHelper.image(Images.placeholder1)} />
      <div className="absolute flex flex-col items-center">
        <span className="font-medium text-dark_blue text-sm">
          Don't be shy...
        </span>
        <div className="w-[15em]">
          <PrimaryButton
            text="Add your first item"
            style="mt-5"
            backgroundColor="bg-blue"
            textColor="text-white"
            icon={ImageHelper.image(Images.addWhite)}
            onClick={() => props.addItemCallback()}
            iconStyle="w-5"
          />
        </div>
      </div>
    </div>
  );
}
