import { useEffect, useState } from "react";
import {
  ValidationField,
  ValidationObject,
} from "../services/ValidationService";

export interface SelectElement {
  id: number;
  value: string;
}

export function CustomSelect(props: {
  onChange: Function;
  elements: SelectElement[];
  validationObject: ValidationObject;
  variant?: "regular" | "filled";
  disableTyping?: boolean;
  defaultValue?: string;
  name?: string;
  width?: string;
  height?: string;
  fontSize?: string;
  disabled?: boolean;
  prefix?: string;
  style?: string;
  placeholder?: string;
}) {
  let valid = true;

  if (
    props.name &&
    props.validationObject &&
    props.validationObject.fields.length > 0
  ) {
    if (
      props.validationObject.fields.map((inv) => inv.name).includes(props.name!)
    ) {
      valid = false;
    }
  }

  const field: ValidationField | undefined =
    props.validationObject.fields.filter((inv) => inv.name === props.name)[0];

  const width: string = props.width ?? "w-48";
  const height: string = props.height ?? "h-8";
  const drawerTopMargin: string = height.replace("h-", "mt-");

  const validClass = `p-1 h-full w-full hover:bg-lightest_purple rounded font-semibold text-dark_blue ${
    props.fontSize ?? "text-base"
  } border-[2px] focus-within:border-lightest_purple border-transparent ${
    props.disabled ? "opacity-60 pointer-events-none" : ""
  }`;
  const invalidClass = `p-1 h-full w-full bg-lightest_red rounded font-semibold text-dark_blue ${props.fontSize} border-[2px] border-red`;
  const variantClass = props.variant === "filled" ? "bg-lightest_purple" : "";
  const extraClass = props.disableTyping ? "cursor-pointer" : "";

  const [focus, setFocus] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const filteredElements = props.elements.filter((e) =>
    e.value.toLowerCase().includes(search.toLowerCase())
  );
  const [changedResult, setChangedResult] = useState<number>(0);

  const [selectedId, setSelectedId] = useState<number | undefined>(
    props.defaultValue ? parseInt(props.defaultValue) : undefined
  );
  let timeout: any;

  useEffect(() => {
    props.onChange(selectedId?.toString() ?? "");
  }, [selectedId, changedResult]);

  function getVal(): string {
    return !selectedId
      ? ""
      : props.elements.filter((e) => e.id === selectedId)[0].value;
  }

  return (
    <div className="flex flex-col">
      <div
        className={`flex flex-row ${
          props.style ?? ""
        } mb-1 ${width} ${height} items-center ${
          valid ? validClass : invalidClass
        } ${variantClass} ${extraClass}`}
      >
        <div className="flex flex-row">
          {props.prefix ? (
            <span className="text-light_blue font-semibold mr-1 cursor-default">
              {props.prefix}
            </span>
          ) : (
            <></>
          )}
          <input
            readOnly={props.disableTyping === true}
            placeholder={props.placeholder ?? ""}
            onBlur={() => {
              clearTimeout(timeout);
              timeout = null;
              setTimeout(() => setFocus(false), 100);
            }}
            onFocus={(_) => setFocus(true)}
            onChange={(e) => {
              const v: string = e.target.value;
              setSelectedId(undefined);
              setSearch(v);
            }}
            name={props.name}
            value={selectedId ? getVal() : search}
            className={`bg-transparent outline-none w-full h-full px-1 ${
              props.disableTyping ? "cursor-pointer" : ""
            }`}
          ></input>
        </div>
      </div>
      {valid ? (
        <></>
      ) : (
        <span className="text-xs text-red mb-1">{field.errorString}</span>
      )}
      <div
        className={`flex flex-col absolute h-60 ${width} ${drawerTopMargin} ${
          focus ? "opacity-100" : "opacity-0"
        } ${
          !focus ? "-translate-y-6" : "translate-y-0"
        } transition-all overflow-auto ${
          !focus ? "pointer-events-none" : "pointer-events-auto"
        }`}
      >
        <div className="h-4"></div>
        <div className={`rounded bg-light_purple2 py-2 overflow-auto`}>
          {filteredElements.map((e) => (
            <div
              onClick={() => {
                setChangedResult(changedResult + 1);
                setSelectedId(e.id);
              }}
              key={`${e.id}-${e.value}`}
              className="h-8 w-full p-3 hover:bg-lightest_purple flex flex-row items-center cursor-pointer text-dark_blue text-sm font-medium"
            >
              <span>{e.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
