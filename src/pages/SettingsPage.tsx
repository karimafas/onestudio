import { Drawer } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Category } from "../objects/Category";
import { StudioLocation } from "../objects/StudioLocation";
import { useState } from "react";
import {
  TypesDrawer,
  TypesDrawerType,
  typesDrawerTypeToString,
  TypesSubmittedData,
} from "../components/TypesDrawer";
import { reloadTypes, reloadUsers } from "../features/data/dataSlice";
import { StudioUser } from "../objects/StudioUser";
import ConfirmDialog from "../components/ConfirmDialog";
import { Header } from "../components/Header";
import { StudioInfoCard } from "../components/StudioInfoCard";
import { TypesRepository } from "../repositories/TypesRepository";

export function SettingsPage() {
  const [drawer, setDrawer] = useState<boolean>(false);
  const [drawerType, setDrawerType] = useState<TypesDrawerType>(
    TypesDrawerType.category
  );
  const user = useAppSelector((state) => state.data.user);
  const categories: Array<Category> = useAppSelector(
    (state) => state.data.categories
  );
  const locations: Array<StudioLocation> = useAppSelector(
    (state) => state.data.locations
  );
  const owners: Array<StudioUser> = useAppSelector((state) =>
    state.data.studioUsers.filter((u) => u.owner)
  );
  const [deleteOpen, setDeleteOpen] = useState<{
    open: boolean;
    data: { type: TypesDrawerType; id: number } | undefined;
  }>({
    open: false,
    data: undefined,
  });
  const dispatch = useAppDispatch();

  function _openDrawer(type: TypesDrawerType) {
    setDrawerType(type);
    setDrawer(true);
  }

  async function _submit(data: TypesSubmittedData) {
    let success = false;

    if (!data.name) return;
    success = await TypesRepository.createType(data.name, drawerType);

    if (success) {
      await dispatch(reloadTypes());
    }

    if (success) setDrawer(false);
  }

  async function _delete(
    id: number | undefined,
    type: TypesDrawerType | undefined
  ) {
    let success = false;

    success = await TypesRepository.deleteType(id!, type!);

    if (success) {
      await dispatch(reloadTypes());
    }
  }

  return (
    <div className="py-3 px-10 w-full h-15">
      <ConfirmDialog
        title={`Delete ${typesDrawerTypeToString(deleteOpen.data?.type!)}`}
        body={`Are you sure you want to delete this ${typesDrawerTypeToString(
          deleteOpen.data?.type!
        )}?`}
        open={deleteOpen.open}
        setOpen={() =>
          setDeleteOpen({ open: !deleteOpen, data: deleteOpen.data! })
        }
        onConfirm={() => _delete(deleteOpen.data?.id, deleteOpen.data?.type)}
      />
      <Drawer
        transitionDuration={300}
        anchor="right"
        open={drawer}
        onClose={() => setDrawer(false)}
      >
        <TypesDrawer
          type={drawerType}
          submit={(data: TypesSubmittedData) => _submit(data)}
        />
      </Drawer>
      <Header />
      <div className="animate-fade">
        <div className="h-8"></div>
        <span className="font-bold text-2xl text-dark_blue">Settings</span>
        <StudioInfoCard collapsed />
        <div className="flex flex-row mt-14 items-start">
          <div className="flex flex-col w-[22rem] h-80 overflow-auto pl-3">
            <div className="flex flex-row items-center justify-between w-full mb-8 pr-4">
              <span className="text-dark_blue font-bold text-xl">
                Categories
              </span>
              <img
                className="w-6 h-6 cursor-pointer"
                src={require("../assets/images/add-blue.png")}
                onClick={() => _openDrawer(TypesDrawerType.category)}
              />
            </div>
            {categories.map((c) => (
              <div
                className="w-72 cursor-pointer group mb-6"
                key={`category-${c.id}`}
              >
                <img
                  className="w-4"
                  src={require("../assets/images/delete.png")}
                  onClick={() =>
                    setDeleteOpen({
                      open: true,
                      data: { type: TypesDrawerType.category, id: c.id },
                    })
                  }
                />
                <div className="bg-white shadow-lg h-10 w-72 group-hover:translate-x-8 transition-all rounded-lg px-4 flex flex-col justify-center relative mt-[-1.8rem]">
                  <span className="font-medium text-sm text-dark_blue">
                    {c.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col w-[22rem] h-80 ml-40 overflow-auto pl-3">
            <div className="flex flex-row items-center justify-between w-full mb-8 pr-4">
              <span className="text-dark_blue font-bold text-xl">
                Locations
              </span>
              <img
                className="w-6 h-6 cursor-pointer"
                src={require("../assets/images/add-blue.png")}
                onClick={() => _openDrawer(TypesDrawerType.location)}
              />
            </div>
            {locations.map((l) => (
              <div
                className="w-72 cursor-pointer group mb-6"
                key={`location-${l.id}`}
              >
                <img
                  className="w-4"
                  src={require("../assets/images/delete.png")}
                  onClick={() =>
                    setDeleteOpen({
                      open: true,
                      data: { type: TypesDrawerType.location, id: l.id },
                    })
                  }
                />
                <div className="bg-white shadow-lg h-10 w-72 group-hover:translate-x-8 transition-all rounded-lg px-4 flex flex-col justify-center relative mt-[-1.8rem]">
                  <span className="font-medium text-sm text-dark_blue">
                    {l.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
