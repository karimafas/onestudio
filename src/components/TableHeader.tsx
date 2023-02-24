import { TableColumn } from "../objects/TableColumn";
import { TableItem } from "../objects/TableItem";
import { HeaderCheckBox } from "./HeaderCheckBox";

export function TableHeader(props: {
  columns: TableColumn[];
  items: TableItem[];
  selected: number[];
  setSelected: Function;
}) {
  const { columns, items, selected, setSelected } = props;
  
  return (
    <div className="w-full flex flex-row font-semibold text-xs text-light_purple mb-4 px-4">
      <div key="select-col" className="flex flex-row justify-center pl-6 pr-10">
        <HeaderCheckBox
          selectedCount={
            selected.filter((i) => items.map((fi) => fi.id).includes(i)).length
          }
          totalCount={items.length}
          deselectAll={() => setSelected([])}
          selectAll={() => setSelected(items.map((i) => i.id))}
        />
      </div>
      {columns.map((c) => (
        <span
          className="whitespace-nowrap"
          key={`header-${c.id}`}
          style={{ width: `${100 / columns.length}%`, paddingRight: 30 }}
        >
          {c.name}
        </span>
      ))}
    </div>
  );
}
