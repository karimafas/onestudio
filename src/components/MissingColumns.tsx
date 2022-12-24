import { useState } from "react";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { StringHelper } from "../helpers/StringHelper";
import { ColumnCsvMatch } from "../pages/ImportPage";
import { ValidationObject } from "../services/ValidationService";
import { CustomSelect, SelectElement } from "./CustomSelect";
import { PrimaryButton } from "./PrimaryButton";

export function MissingColumns(props: {
  match: ColumnCsvMatch[];
  csvColumns: string[];
  missingColumns: string[];
}) {
  const { match, csvColumns, missingColumns } = props;
  const [validationObject, setValidationObject] = useState<ValidationObject>(
    ValidationObject.empty()
  );
  const [dfo, setDfo] = useState<ColumnCsvMatch[]>(match);
  const elements: SelectElement[] = csvColumns.map((e, index) => {
    return { id: index, value: e };
  });

  return (
    <div className="flex flex-col items-center">
      <span className="text-dark_blue text-sm mb-4">
        Looks like your CSV is missing some columns:
      </span>
      {missingColumns.map((m) => (
        <div className="flex flex-row justify-between items-start w-[20rem] mb-4">
          <span className="text-light_blue font-semibold mt-[5px]">
            {StringHelper.toFirstUpperCase(m)}
          </span>
          <CustomSelect
            elements={elements}
            validationObject={validationObject}
            defaultValue={
              match.filter((m) => m.appColumn === m.appColumn)[0].csvColumn
            }
            name={m}
            onChange={(v: string) => {
              if (v === "") return;
              const id = parseInt(v);
              const index = dfo.map((e) => e.appColumn).indexOf(m);
              const newDfo = [...dfo];
              newDfo[index].csvColumn = elements.filter(
                (e) => e.id === id
              )[0].value;
              setDfo(newDfo);
            }}
            key={`col-${m}`}
          />
        </div>
      ))}
      <PrimaryButton
        text="Continue"
        onClick={() => {}}
        icon={ImageHelper.image(Images.forwardPurple)}
        iconStyle="w-2"
        style="w-32"
      />
    </div>
  );
}
