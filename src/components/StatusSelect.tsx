import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getLastUserActivity } from "../features/data/dataSlice";
import { StringHelper } from "../helpers/StringHelper";

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
  itemId: number;
  width?: string;
  height?: string;
  style?: string;
}) {
  const dispatch = useAppDispatch();
  const defaultValue = useAppSelector(
    (state) =>
      state.data.items.filter((i) => i.id === props.itemId)[0].status.id
  );
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
    defaultValue
  );
  const statuses = useAppSelector((state) => state.data.statuses);
  const ref = useRef<HTMLInputElement>(null);
  const dataUpdate = useAppSelector((state) => state.data.forceUpdate);

  useEffect(() => {
    if (dataUpdate) {
      setSelectedId(defaultValue);
      setHasChanged(true);
      dispatch(getLastUserActivity());
      return;
    } else if (hasChanged) {
      props.onChange(selectedId?.toString() ?? "");
      setHasChanged(false);
      return;
    } else {
      const handleClickOutside = (event: any) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setFocus(false);
        }
      };
      document.addEventListener("click", handleClickOutside, true);
      return () => {
        document.removeEventListener("click", handleClickOutside, true);
      };
    }
  }, [selectedId, hasChanged, dataUpdate]);

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

    return {
      title: StringHelper.toFirstUpperCase(
        statuses.filter((s) => s.id === id)[0].displayName
      ),
      hasFlag: true,
      flagColor: statuses.filter((s) => s.id == id)[0].backgroundColor,
    };
  }

  return (
    <div
      className="flex flex-col cursor-pointer"
      onClick={() => setFocus(!focus)}
      ref={ref}
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
        <div className={`rounded-lg bg-light_purple2 py-2 overflow-auto`}>
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
