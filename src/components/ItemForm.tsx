import { useAppSelector } from "../app/hooks";
import { Category } from "../objects/Category";
import { ItemDfo } from "../objects/InventoryItem";
import { StudioLocation } from "../objects/StudioLocation";
import { StudioUser } from "../objects/StudioUser";
import { ValidationObject } from "../services/ValidationService";
import { CustomSelect } from "./CustomSelect";
import { CustomTextField } from "./CustomTextField";

export function ItemForm(props: {
  disabled: boolean;
  validationObject: ValidationObject;
  setDfo: Function;
  dfo: ItemDfo;
}) {
  const { disabled, validationObject, setDfo, dfo } = props;

  const categories: Category[] = useAppSelector(
    (state) => state.data.categories
  );
  const locations: StudioLocation[] = useAppSelector(
    (state) => state.data.locations
  );
  const owners: StudioUser[] = useAppSelector((state) =>
    state.data.studioUsers.filter((u) => u.owner)
  );

  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col h-full">
        <CustomTextField
          placeholder="Manufacturer"
          disabled={disabled}
          validationObject={validationObject}
          fontSize="text-xl"
          height="h-10"
          defaultValue={dfo.manufacturer}
          name="manufacturer"
          onChange={(v: string) => setDfo({ ...dfo, manufacturer: v })}
        />
        <CustomTextField
          placeholder="Model"
          disabled={disabled}
          validationObject={validationObject}
          fontSize="text-lg"
          defaultValue={dfo.model}
          name="model"
          onChange={(v: string) => setDfo({ ...dfo, model: v })}
        />
        <div className="w-80 mt-4">
          <div className="flex flex-row justify-between items-start">
            <span className="text-light_blue font-semibold ml-1 mt-[5px]">
              Price
            </span>
            <CustomTextField
              disabled={disabled}
              validationObject={validationObject}
              defaultValue={dfo.price}
              name="price"
              onChange={(v: string) => setDfo({ ...dfo, price: v })}
              prefix="£"
            />
          </div>
          <div className="flex flex-row justify-between items-start">
            <span className="text-light_blue font-semibold ml-1 mt-[5px]">
              Serial
            </span>
            <CustomTextField
              disabled={disabled}
              validationObject={validationObject}
              defaultValue={`${dfo.serial}`}
              name="serial"
              onChange={(v: string) => setDfo({ ...dfo, serial: v })}
            />
          </div>
          <div className="flex flex-row justify-between items-start">
            <span className="text-light_blue font-semibold ml-1 mt-[5px]">
              Notes
            </span>
            <CustomTextField
              disabled={disabled}
              validationObject={validationObject}
              name="notes"
              defaultValue={`${dfo.notes}`}
              onChange={(v: string) => setDfo({ ...dfo, notes: v })}
            />
          </div>
        </div>
        <div className="w-80">
          <div className="flex flex-row justify-between items-start">
            <span className="text-light_blue font-semibold ml-1 mt-[5px]">
              Location
            </span>
            <CustomSelect
              elements={locations.map((l) => {
                return {
                  id: l.id,
                  value: l.name,
                };
              })}
              disabled={disabled}
              validationObject={validationObject}
              defaultValue={`${dfo.locationId}`}
              name="locationId"
              onChange={(v: string) => {
                setDfo({ ...dfo, locationId: v });
              }}
              key={`location-${dfo.locationId}`}
            />
          </div>
          <div className="flex flex-row justify-between items-start">
            <span className="text-light_blue font-semibold ml-1 mt-[5px]">
              Category
            </span>
            <CustomSelect
              elements={categories.map((c) => {
                return {
                  id: c.id,
                  value: c.name,
                };
              })}
              disabled={disabled}
              validationObject={validationObject}
              defaultValue={`${dfo.categoryId}`}
              name="categoryId"
              onChange={(v: string) => {
                setDfo({ ...dfo, categoryId: v });
              }}
              key={`category-${dfo.categoryId}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
