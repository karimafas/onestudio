import { Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { deleteDataItem, reloadItem } from "../features/data/dataSlice";
import { deleteItems, updateItem } from "../features/data/inventorySlice";
import { ItemDfo } from "../objects/InventoryItem";
import { EventSubmittedData, FaultDrawer } from "../components/FaultDrawer";
import { ApiHelper } from "../helpers/ApiHelper";
import { Category } from "../objects/Category";
import { StudioLocation } from "../objects/StudioLocation";
import { StudioUser } from "../objects/StudioUser";
import { Header } from "../components/Header";
import { CustomTextField } from "../components/CustomTextField";
import { PrimaryButton } from "../components/PrimaryButton";
import { SquareButton } from "../components/SquareButton";
import {
  RecentActivity,
  RecentActivityType,
} from "../components/RecentActivity";
import { ValidationObject } from "../helpers/ValidationHelper";
import ConfirmDialog from "../components/ConfirmDialog";

function useForceUpdate() {
  const [_, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

export function ItemPage() {
  const forceUpdate = useForceUpdate();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  const id = parseInt(params["id"] ?? "0");
  const item = useAppSelector(
    (state) => state.data.items.filter((i) => i.id === id)[0]
  );
  const [disabled, setDisabled] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [drawer, setDrawer] = useState<boolean>(false);
  const [loadingTimeline, setLoadingTimeline] = useState<boolean>(true);
  const categories: Array<Category> = useAppSelector(
    (state) => state.data.categories
  );
  const locations: Array<StudioLocation> = useAppSelector(
    (state) => state.data.locations
  );
  const owners: Array<StudioUser> = useAppSelector((state) =>
    state.data.studioUsers.filter((u) => u.owner)
  );
  const [validationObject, setValidationObject] = useState<ValidationObject>(
    ValidationObject.empty()
  );
  const [dfo, setDfo] = useState<ItemDfo>({
    id: item.id,
    manufacturer: item.manufacturer,
    model: item.model,
    location_id: item.locationId + "",
    serial: item.serial,
    m_number: item.mNumber,
    price: item.price + "",
    category_id: item.categoryId + "",
    owner_id: item.ownerId + "",
    notes: item.notes,
    status: item.status,
  });

  async function init() {
    if (item && item.events && item.events.length === 0) {
      await item.initEvents();
      setLoadingTimeline(false);
    } else {
      setLoadingTimeline(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  async function _createEvent(data: EventSubmittedData) {
    const success = await ApiHelper.createEvent(
      data.itemId,
      data.notes,
      data.type
    );

    if (success) {
      await dispatch(reloadItem(item.id));
      forceUpdate();
      setDrawer(false);
    }
  }

  async function _updateItem(data: ItemDfo) {
    setDisabled(true);

    const result = await dispatch(updateItem(data));
    if (result.payload) {
      await dispatch(reloadItem(item.id));
      await item.initEvents();
      forceUpdate();
    }

    setDisabled(false);
  }

  async function _delete() {
    const success = await dispatch(deleteItems([id]));
    if (success.payload) {
      dispatch(deleteDataItem(id));
      navigate("/inventory");
    }
  }

  const handleSubmit = () => {
    const object: ValidationObject = validationObject.validate({
      dfo: dfo,
      notNull: [
        "manufacturer",
        "model",
        "location_id",
        "serial",
        "m_number",
        "price",
        "category_id",
        "owner_id",
      ],
      number: ["price"],
    });

    if (object.isValid) {
      _updateItem(dfo);
    }

    setValidationObject(object);
  };

  debugger;

  if (!item) {
    return <div></div>;
  } else {
    return (
      <div className="py-3 px-10 w-full h-[100vh]">
        <ConfirmDialog
          title="Delete Item"
          body="Are you sure you want to delete this item?"
          open={deleteOpen}
          setOpen={() => setDeleteOpen(!deleteOpen)}
          onConfirm={_delete}
        />
        <Drawer
          transitionDuration={300}
          anchor="right"
          open={drawer}
          onClose={() => setDrawer(false)}
        >
          <FaultDrawer
            submit={(data: EventSubmittedData) => {
              _createEvent(data);
            }}
            item={item}
          />
        </Drawer>
        <Header />
        <div className="flex flex-col w-full h-[85vh] animate-fade">
          <div className="w-full flex flex-row justify-between mt-6">
            <div
              onClick={() => navigate("/inventory")}
              className="w-48 flex flex-row ml-1 items-center cursor-pointer transition-all"
            >
              <img
                className="h-[8.5px] mr-3"
                src={require("../assets/images/back-blue.png")}
              />
              <span className="font-semibold text-light_purple text-sm">
                Back to inventory
              </span>
            </div>
            <div className="flex flex-row">
              <PrimaryButton
                backgroundColor="bg-blue_100"
                textColor="text-white"
                icon={require("../assets/images/fault.png")}
                text="Report a fault"
                onClick={() => handleSubmit()}
              />
              <div className="mr-4"></div>
              <SquareButton
                icon={require("../assets/images/delete.png")}
                onClick={() => setDeleteOpen(true)}
              />
              <div className="mr-4"></div>
              <PrimaryButton
                icon={require("../assets/images/save.png")}
                text="Save"
                onClick={() => handleSubmit()}
              />
            </div>
          </div>
          <div className="flex flex-row h-full justify-between">
            <div className="flex flex-col h-full">
              <CustomTextField
                disabled={disabled}
                validationObject={validationObject}
                fontSize="text-xl"
                width="w-48"
                height="h-10"
                defaultValue={dfo.manufacturer}
                name="manufacturer"
                onChange={(v: string) => setDfo({ ...dfo, manufacturer: v })}
              />
              <CustomTextField
                disabled={disabled}
                validationObject={validationObject}
                fontSize="text-lg"
                width="w-48"
                height="h-8"
                defaultValue={dfo.model}
                name="model"
                onChange={(v: string) => setDfo({ ...dfo, model: v })}
              />
              <div className="w-80 mt-4">
                <div className="flex flex-row justify-between items-center">
                  <span className="text-light_blue font-semibold ml-1">
                    Price
                  </span>
                  <CustomTextField
                    disabled={disabled}
                    validationObject={validationObject}
                    fontSize="text-base"
                    height="h-8"
                    width="w-48"
                    defaultValue={dfo.price}
                    name="price"
                    onChange={(v: string) => setDfo({ ...dfo, price: v })}
                    prefix="£"
                  />
                </div>
                <div className="flex flex-row justify-between items-center">
                  <span className="text-light_blue font-semibold ml-1">
                    Serial
                  </span>
                  <CustomTextField
                    disabled={disabled}
                    validationObject={validationObject}
                    fontSize="text-base"
                    height="h-8"
                    width="w-48"
                    defaultValue={`${dfo.serial}`}
                    name="serial"
                    onChange={(v: string) => setDfo({ ...dfo, serial: v })}
                  />
                </div>
                <div className="flex flex-row justify-between items-center">
                  <span className="text-light_blue font-semibold ml-1">
                    M-Number
                  </span>
                  <CustomTextField
                    disabled={disabled}
                    validationObject={validationObject}
                    fontSize="text-base"
                    height="h-8"
                    width="w-48"
                    defaultValue={`${dfo.m_number}`}
                    name="mNumber"
                    onChange={(v: string) => setDfo({ ...dfo, m_number: v })}
                  />
                </div>
                <div className="flex flex-row justify-between items-center">
                  <span className="text-light_blue font-semibold ml-1">
                    Notes
                  </span>
                  <CustomTextField
                    disabled={disabled}
                    validationObject={validationObject}
                    name="notes"
                    fontSize="text-base"
                    height="h-8"
                    width="w-48"
                    defaultValue={`${dfo.notes}`}
                    onChange={(v: string) => setDfo({ ...dfo, notes: v })}
                  />
                </div>
              </div>
              <div className="w-80 mt-4">
                <div className="flex flex-row justify-between items-center">
                  <span className="text-light_blue font-semibold ml-1">
                    Location
                  </span>
                  <CustomTextField
                    disabled={disabled}
                    validationObject={validationObject}
                    fontSize="text-base"
                    height="h-8"
                    width="w-48"
                    defaultValue={`${dfo.location_id}`}
                    name="locationId"
                    onChange={(v: string) => setDfo({ ...dfo, location_id: v })}
                  />
                </div>
                <div className="flex flex-row justify-between items-center">
                  <span className="text-light_blue font-semibold ml-1">
                    Category
                  </span>
                  <CustomTextField
                    disabled={disabled}
                    validationObject={validationObject}
                    fontSize="text-base"
                    height="h-8"
                    width="w-48"
                    defaultValue={`${dfo.category_id}`}
                    name="categoryId"
                    onChange={(v: string) => setDfo({ ...dfo, category_id: v })}
                  />
                </div>
                <div className="flex flex-row justify-between items-center">
                  <span className="text-light_blue font-semibold ml-1">
                    Owner
                  </span>
                  <CustomTextField
                    disabled={disabled}
                    validationObject={validationObject}
                    fontSize="text-base"
                    height="h-8"
                    width="w-48"
                    defaultValue={`${dfo.owner_id}`}
                    name="ownerId"
                    onChange={(v: string) => setDfo({ ...dfo, owner_id: v })}
                  />
                </div>
              </div>
            </div>
            {loadingTimeline ? (
              <></>
            ) : (
              <div className="h-[75vh] w-1/3 flex flex-row justify-end">
                <RecentActivity
                  type={RecentActivityType.item}
                  events={item.events}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
