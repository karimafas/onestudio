import { useAppSelector } from "../app/hooks";
import { ItemStatus } from "../objects/InventoryItem";

export function InventoryInfoCard() {
  const items = useAppSelector((state) => state.data.items);
  let price = 0;

  for (const p of items.map((i) => i.price)) {
    price += p;
  }

  const faulty = items.filter((i) => i.status === ItemStatus.faulty).length;
  const working = items.filter((i) => i.status === ItemStatus.working).length;

  return (
    <div className="cursor-pointer hover:translate-y-[-0.5rem] transition-all duration-500">
      <div className="h-50 w-72 ml-12 bg-blue shadow-blue_50 shadow-2xl rounded-2xl mt-8 flex flex-col p-8">
        <div className="flex flex-row">
          <div className="border-dashed border-light_blue border-2 h-12 w-12 rounded-xl flex flex-row items-center justify-center">
            <img
              src={require("../assets/images/inventory-white.png")}
              className="p-[10px]"
            />
          </div>
          <div className="flex flex-col ml-3">
            <span className="text-white font-semibold text-lg">Inventory</span>
            <span className="text-light_blue font-medium text-sm">
              {items.length} items
            </span>
          </div>
        </div>
        <div className="flex flex-row px-2">
          <span className="mt-4 text-2xl text-white font-medium">£{price}</span>
        </div>
        <div className="w-full flex flex-row justify-around text-xs mt-3 text-white">
          <span>
            <span className="font-bold">{working}</span> working
          </span>
          <span>
            <span className="font-bold">{faulty}</span> faulty
          </span>
        </div>
      </div>
      <div className="h-50 w-72 ml-12 flex flex-row p-8 relative mt-[-12rem] z-[100] justify-end">
        <img
          className="w-[4.5px]"
          src={require("../assets/images/arrow-right.png")}
        />
      </div>
    </div>
  );
}
