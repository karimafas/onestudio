import { useEffect, useState } from "react";
import { useAppSelector } from "../app/hooks";
import { PrimitiveStatuses } from "../objects/Status";

export interface SelectElement {
  id: number;
  value: string;
}

interface StatusSelectOption {
  title: string;
  hasFlag: boolean;
  flagColor: string;
}

export function StatusSelect(props: {
  onChange: Function;
  elements: SelectElement[];
  defaultValue: string;
  width?: string;
  height?: string;
  style?: string;
}) {
  const width: string = props.width ?? "w-48";
  const height: string = props.height ?? "h-8";
  const drawerTopMargin: string = height.replace("h-", "mt-");

  const [focus, setFocus] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const filteredElements = props.elements.filter((e) =>
    e.value.toLowerCase().includes(search.toLowerCase())
  );
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | undefined>(
    props.defaultValue ? parseInt(props.defaultValue) : undefined
  );
  const statuses = useAppSelector((state) => state.data.statuses);

  useEffect(() => {
    if (hasChanged) {
      props.onChange(selectedId?.toString() ?? "");
      debugger;
      setHasChanged(false);
    }
  }, [selectedId, hasChanged]);

  function getId(): number | undefined {
    return !selectedId
      ? undefined
      : props.elements.filter((e) => e.id === selectedId)[0].id;
  }

  function getOption(id: number): StatusSelectOption {
    const primitiveStatuses = statuses.filter((s) => s.primitive);
    const ids = primitiveStatuses.map((ps) => ps.id);

    if (!ids.includes(id)) {
      return {
        title: filteredElements.filter((e) => e.id === id)[0].value,
        hasFlag: false,
        flagColor: "",
      };
    }

    let color: string;

    const workingId = primitiveStatuses.filter(
      (s) => s.primitive && s.name === PrimitiveStatuses.working
    )[0].id;
    const faultyId = primitiveStatuses.filter(
      (s) => s.primitive && s.name === PrimitiveStatuses.faulty
    )[0].id;
    const repairingId = primitiveStatuses.filter(
      (s) => s.primitive && s.name === PrimitiveStatuses.repairing
    )[0].id;

    switch (id) {
      case workingId:
        color = "bg-green";
        break;
      case faultyId:
        color = "bg-red";
        break;
      case repairingId:
        color = "bg-grey";
        break;
    }

    return {
      title: filteredElements.filter((e) => e.id === id)[0].value,
      hasFlag: true,
      flagColor: color!,
    };
  }

  return (
    <div
      className="flex flex-col cursor-pointer"
      onClick={() => setFocus(!focus)}
    >
      <div
        className={`flex flex-row ${
          props.style ?? ""
        } mb-1 ${width} ${height} items-center bg-lightest_purple rounded-lg h-9 text-dark_blue font-medium`}
      >
        <div className="flex flex-row w-full justify-center items-center">
          <span className="mr-3">
            {!getId() ? "" : getOption(getId()!).title}
          </span>
          <div
            className={`h-2 w-2 rounded-lg ${
              getOption(getId()!).flagColor
            } shadow-md`}
          ></div>
        </div>
      </div>
      <div
        className={`flex flex-col absolute h-60 ${width} ${drawerTopMargin} ${
          focus ? "opacity-100" : "opacity-0"
        } ${
          !focus ? "-translate-y-6" : "translate-y-0"
        } transition-all overflow-auto ${
          !focus ? "pointer-events-none" : "pointer-events-auto"
        }`}
      >
        <div className="h-6"></div>
        <div className={`rounded bg-light_purple2 py-2 overflow-auto`}>
          {filteredElements.map((e) => (
            <div
              onClick={() => {
                setHasChanged(true);
                setSelectedId(e.id);
              }}
              key={`${e.id}-${e.value}`}
              className="h-8 w-full p-3 hover:bg-lightest_purple flex flex-row items-center cursor-pointer text-dark_blue text-sm font-medium"
            >
              <span className="mr-3">{getOption(e.id).title}</span>
              <div
                className={`h-2 w-2 rounded-lg ${
                  getOption(e.id).flagColor
                } shadow-md`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
