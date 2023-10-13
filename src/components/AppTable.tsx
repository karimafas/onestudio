import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { TableColumn } from "../objects/TableColumn";
import { TableItem } from "../objects/TableItem";
import { CheckBox } from "./CheckBox";
import { EmptyInventoryPlaceholder } from "./EmptyInventoryPlaceholder";
import { TableHeader } from "./TableHeader";
import { TablePaginationControls } from "./TablePaginationControls";

export function AppTable(props: {
  searchQuery: string;
  selected: number[];
  setSelected: Function;
  itemsPerPage: number;
  width: number;
  items: TableItem[];
  filteredItems: TableItem[];
  page: number;
  setPage: Function;
  totalPages: number;
  addItemCallback: Function;
  columns: TableColumn[];
}) {
  const {
    columns,
    items,
    filteredItems,
    page,
    setPage,
    totalPages,
    addItemCallback,
    selected,
    setSelected,
  } = props;
  const navigate = useNavigate();
  const locations = useAppSelector((state) => state.data.locations);
  const categories = useAppSelector((state) => state.data.categories);
  const owners = useAppSelector((state) => state.data.studioUsers);

  function selectRow(i: TableItem) {
    if (selected.includes(i.id)) {
      const index: number = selected.indexOf(i.id);
      setSelected(selected.filter((id, idx) => idx !== index));
    } else {
      setSelected([...selected, i.id]);
    }
  }

  if (items.length === 0)
    return <EmptyInventoryPlaceholder addItemCallback={addItemCallback} />;

  return (
    <div className="flex flex-col justify-between grow mt-8">
      <div>
        <TableHeader
          columns={columns}
          items={items}
          selected={selected}
          setSelected={setSelected}
        />
        <div>
          {filteredItems.map((i) => (
            <div
              className="w-full h-20 bg-white shadow-lg rounded-lg text-dark_blue text-xs flex flex-row items-center px-4 font-medium mb-4 cursor-pointer"
              key={`item-${i.id}`}
            >
              <div
                key={`select-${i.id}`}
                className="flex flex-row justify-center pl-6 pr-10"
              >
                <CheckBox
                  selected={selected.includes(i.id)}
                  onClick={() => selectRow(i)}
                />
              </div>
              {i.renderRow(
                columns,
                () => navigate(`${i.id}`),
                locations,
                categories,
                owners
              )}
            </div>
          ))}
        </div>
      </div>
      <TablePaginationControls
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </div>
  );
}
