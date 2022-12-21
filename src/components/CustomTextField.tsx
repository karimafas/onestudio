import {
  ValidationField,
  ValidationObject,
} from "../services/ValidationService";

export function CustomTextField(props: {
  onChange: Function;
  validationObject: ValidationObject;
  defaultValue?: string;
  width?: string;
  height?: string;
  fontSize?: string;
  disabled?: boolean;
  prefix?: string;
  style?: string;
  name?: string;
  placeholder?: string;
  variant?: "transparent" | "outlined";
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

  const validClass = `p-1 h-full w-full hover:bg-lightest_purple rounded font-semibold text-dark_blue ${
    props.fontSize ?? "text-base"
  } border-[2px] ${
    props.variant === "outlined"
      ? "border-lightest_purple"
      : "focus-within:border-lightest_purple border-transparent"
  } ${props.disabled ? "opacity-60 pointer-events-none" : ""}`;
  const invalidClass = `p-1 h-full w-full bg-lightest_red rounded font-semibold text-dark_blue ${props.fontSize} border-[2px] border-red`;

  return (
    <div className="flex flex-col">
      <div
        className={`flex flex-row ${props.style ?? ""} mb-1 ${
          props.width ?? "w-48"
        } ${props.height ?? "h-8"} items-center ${
          valid ? validClass : invalidClass
        }`}
      >
        <div className="flex flex-row w-full">
          {props.prefix ? (
            <span className="text-light_blue font-semibold mr-1 cursor-default">
              {props.prefix}
            </span>
          ) : (
            <></>
          )}
          <input
            placeholder={props.placeholder ?? ""}
            onChange={(e) => props.onChange(e.target.value)}
            name={props.name}
            defaultValue={props.defaultValue ?? ""}
            className="bg-transparent outline-none w-full h-full"
          ></input>
        </div>
      </div>
      {valid ? (
        <></>
      ) : (
        <span className="text-xs text-red mb-1">{field.errorString}</span>
      )}
    </div>
  );
}
