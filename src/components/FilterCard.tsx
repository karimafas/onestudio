import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { clearFilter, FilterType, selectOption } from "../features/data/filterSlice";

export interface FilterOption {
  id: number;
  name: string;
  type: FilterType;
}

export function FilterCard(props: {
  options: FilterOption[];
  selected: FilterOption[];
  title: string;
}) {
  const dispatch = useAppDispatch();
  const { options, title, selected } = props;
  const hasFilters = selected.length > 0;
  const border = hasFilters ? "" : "border-lightest_purple border-[3px]";
  const background = hasFilters ? "bg-blue" : "";
  const textColor = hasFilters ? "text-white" : "text-dark_blue";
  const ref = useRef<HTMLInputElement>(null);
  const [showBox, setShowBox] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        showBox && setShowBox(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [showBox]);

  return (
    <div ref={ref}>
      <div
        className={`w-[7em] h-[2em] ${background} ${border} rounded-md flex flex-row items-center justify-center cursor-pointer`}
        onClick={() => setShowBox(!showBox)}
      >
        <span className={`font-medium ${textColor} text-xs`}>{title}</span>
      </div>
      {hasFilters ? (
        <div className="h-4 w-4 bg-light_purple shadow-xl rounded-[100%] mt-[-10px] ml-[6.2em] absolute flex flex-row items-center justify-center">
          <span className="text-white text-[9px] font-bold">
            {selected.length}
          </span>
        </div>
      ) : (
        <></>
      )}
      {showBox ? (
        <div className="w-[15em] h-[12em] shadow-xl absolute mt-3 rounded p-4 bg-white">
          <div className="w-full flex flex-row justify-end mb-2 h-[10%]">
            <span
              className="text-[10px] font-medium text-dark_blue cursor-pointer hover:underline"
              onClick={() => {
                dispatch(clearFilter(options[0].type));
              }}
            >
              Clear filter
            </span>
          </div>
          <div className="grow flex flex-col overflow-auto px-3 py-3 bg-lightest_purple2 rounded-lg h-[90%]">
            {options.map((o) => (
              <FilterOptionCard
                option={o}
                selected={selected.map((s) => s.id).includes(o.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

function FilterOptionCard(props: { option: FilterOption; selected: boolean }) {
  const { option, selected } = props;

  const dispatch = useAppDispatch();
  const textColor = selected ? "text-white" : "text-dark_blue";
  const background = selected ? "bg-blue" : "";

  function _select() {
    dispatch(selectOption(option));
  }

  return (
    <div className="mb-2 cursor-pointer min-h-[2em]" onClick={_select}>
      <div
        className={`w-full h-full ${background} rounded px-3 flex flex-row items-center transition-all`}
      >
        <span className={`text-sm font-medium ${textColor}`}>
          {option.name}
        </span>
      </div>
    </div>
  );
}
