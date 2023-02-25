import { useEffect, useState } from "react";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { PrimaryButton } from "./PrimaryButton";
import Papa from "papaparse";
import { ImportError } from "../pages/ImportPage";
import { AppAlert, AppAlertType } from "./AppAlert";
import { toFirstUpperCase } from "../helpers/StringHelper";

export function UploadCsv(props: {
  callback: Function;
  upload: Function;
  missingColumns: string[];
  error: ImportError;
}) {
  const [selectedFile, setSelectedFile] = useState();
  const [itemsFound, setItemsFound] = useState<number>(0);
  var reader = new FileReader();

  const changeHandler = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    try {
      document.getElementById("file_button")!.onclick = function () {
        document.getElementById("file_input")!.click();
      };
    } catch (e) {}

    if (selectedFile) {
      reader.readAsText(selectedFile);
    }
  }, [selectedFile]);

  reader.onload = function (event: any) {
    const csvData = event.target.result;
    const parsedData = Papa.parse(csvData);
    setItemsFound(parsedData.data.length - 1);
    props.callback(parsedData);
    setSelectedFile(undefined);
  };

  const message =
    props.error === ImportError.missingColumns
      ? `${props.error} ${props.missingColumns
          .map((mc) => toFirstUpperCase(mc))
          .join(", ")}.`
      : props.error;

  return (
    <div className="flex flex-col items-center">
      <img className="w-40 mb-8" src={ImageHelper.image(Images.uploadCloud)} />
      <input
        id="file_input"
        type="file"
        name="file"
        onChange={changeHandler}
        hidden
      />
      {props.error === ImportError.none ? (
        <PrimaryButton
          id="file_button"
          text="Upload CSV"
          onClick={() => {}}
          icon={ImageHelper.image(Images.uploadFile)}
          iconStyle="w-4"
        />
      ) : (
        <></>
      )}
      {![ImportError.none, ImportError.success].includes(props.error) ? (
        <AppAlert type={AppAlertType.error} message={message} style="mt-6" />
      ) : (
        <></>
      )}
      {props.error === ImportError.success ? (
        <PrimaryButton
          id="upload_button"
          text={`Import ${itemsFound} item(s)`}
          onClick={props.upload}
          icon={ImageHelper.image(Images.forwardBlue)}
          iconStyle="w-[7px]"
        />
      ) : (
        <></>
      )}
    </div>
  );
}
