import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Category } from "../objects/Category";
import { StudioLocation } from "../objects/StudioLocation";
import { useEffect, useState } from "react";
import { reloadTypes } from "../features/data/dataSlice";
import ConfirmDialog from "../components/ConfirmDialog";
import { Header } from "../components/Header";
import { StudioInfoCard } from "../components/StudioInfoCard";
import DeleteIcon from "@mui/icons-material/Delete";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { AddTypesDialog, TypesDialogType } from "../components/AddTypesDialog";
import { Status } from "../objects/Status";
import { StatusRepository } from "../repositories/StatusRepository";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { LocationRepository } from "../repositories/LocationRepository";
import { openSnack, SnackType } from "../features/data/uiSlice";
import { InventoryItem } from "../objects/InventoryItem";
import { AddUserCard } from "../components/AddUserCard";
import InviteUserDialog from "../components/InviteUserDialog";
import { useSearchParams } from "react-router-dom";
import { toFirstUpperCase } from "../helpers/StringHelper";

export interface TypesSubmittedData {
  name: string;
}

export function SettingsPage() {
  const [searchParams] = useSearchParams();
  const [dialog, setDialog] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<TypesDialogType>(
    TypesDialogType.category
  );
  const items: InventoryItem[] = useAppSelector((state) => state.data.items);
  const categories: Category[] = useAppSelector(
    (state) => state.data.categories
  );
  const locations: StudioLocation[] = useAppSelector(
    (state) => state.data.locations
  );
  const statuses: Status[] = useAppSelector((state) => state.data.statuses);
  const [deleteOpen, setDeleteOpen] = useState<{
    open: boolean;
    data: { type: TypesDialogType; id: number } | undefined;
  }>({
    open: false,
    data: undefined,
  });
  const [inviteUserDialog, setInviteUserDialog] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const inviteUser = searchParams.get("inviteUser");
    if (inviteUser)
      setTimeout(() => {
        setInviteUserDialog(true);
      }, 200);
  }, []);

  function _openDrawer(type: TypesDialogType) {
    setDialogType(type);
    setDialog(true);
  }

  async function _submit(data: TypesSubmittedData) {
    let success = false;

    if (!data.name) return;

    switch (dialogType) {
      case TypesDialogType.status:
        success = await StatusRepository.createStatus(data.name);
        break;
      case TypesDialogType.category:
        success = await CategoryRepository.createCategory(data.name);
        break;
      case TypesDialogType.location:
        success = await LocationRepository.createLocation(data.name);
        break;
    }

    if (success) {
      await dispatch(reloadTypes());
    }

    if (success) setDialog(false);
  }

  async function _delete(
    id: number | undefined,
    type: TypesDialogType | undefined
  ) {
    if (!id) return;
    if (!type) return;
    let success = false;

    const blockDelete = isTypeReferenced();
    if (blockDelete)
      return dispatch(
        openSnack({
          message: `Can't delete a ${deleteOpen.data?.type} in use.`,
          type: SnackType.error,
        })
      );

    switch (deleteOpen.data?.type) {
      case TypesDialogType.status:
        const isPrimitive = statuses.filter((s) => s.id === id)[0].primitive;
        if (isPrimitive)
          dispatch(
            openSnack({
              message: "Can't delete a default status.",
              type: SnackType.error,
            })
          );
        success = await StatusRepository.deleteStatus(id);
        break;
      case TypesDialogType.category:
        success = await CategoryRepository.deleteCategory(id);
        break;
      case TypesDialogType.location:
        success = await LocationRepository.deleteLocation(id);
        break;
    }

    if (success) {
      await dispatch(reloadTypes());
    }
  }

  function isTypeReferenced(): boolean {
    let count = 0;
    switch (deleteOpen.data?.type) {
      case TypesDialogType.status:
        count = items.filter((i) => i.status.id === deleteOpen.data?.id).length;
        break;
      case TypesDialogType.category:
        count = items.filter(
          (i) => i.categoryId === deleteOpen.data?.id
        ).length;
        break;
      case TypesDialogType.location:
        count = items.filter(
          (i) => i.locationId === deleteOpen.data?.id
        ).length;
        break;
    }

    return count > 0;
  }

  return (
    <div className="py-3 px-10 w-full h-15 h-screen overflow-auto">
      <ConfirmDialog
        icon={<DeleteIcon className="mr-1" fontSize="small" />}
        title={`Delete ${deleteOpen.data?.type ?? ""}`}
        body={`Are you sure you want to delete this ${
          deleteOpen.data?.type ?? ""
        }?`}
        open={deleteOpen.open}
        setOpen={() =>
          setDeleteOpen({ open: !deleteOpen, data: deleteOpen.data! })
        }
        onConfirm={() => _delete(deleteOpen.data?.id, deleteOpen.data?.type)}
      />
      <AddTypesDialog
        open={dialog}
        setOpen={setDialog}
        type={dialogType}
        callback={_submit}
      />
      <InviteUserDialog open={inviteUserDialog} setOpen={setInviteUserDialog} />
      <Header />
      <div className="animate-fade">
        <div className="h-4"></div>
        <div className="flex flex-row w-full">
          <StudioInfoCard collapsed />
          <AddUserCard onClick={() => setInviteUserDialog(true)} />
        </div>
        <div className="flex flex-row mt-14 items-start">
          <div className="flex flex-col w-[22rem] max-h-80 overflow-auto pl-3">
            <div className="flex flex-row items-center justify-between w-full mb-8 pr-4">
              <span className="text-dark_blue font-bold text-xl">
                Categories
              </span>
              <img
                className="w-6 h-6 cursor-pointer"
                src={ImageHelper.image(Images.addBlue)}
                onClick={() => _openDrawer(TypesDialogType.category)}
              />
            </div>
            {categories.map((c) => (
              <div
                className="w-72 cursor-pointer group mb-6"
                key={`category-${c.id}`}
              >
                <img
                  className="w-4"
                  src={ImageHelper.image(Images.delete)}
                  onClick={() =>
                    setDeleteOpen({
                      open: true,
                      data: { type: TypesDialogType.category, id: c.id },
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
          <div className="flex flex-col w-[22rem] max-h-80 ml-40 overflow-auto pl-3">
            <div className="flex flex-row items-center justify-between w-full mb-8 pr-4">
              <span className="text-dark_blue font-bold text-xl">
                Locations
              </span>
              <img
                className="w-6 h-6 cursor-pointer"
                src={ImageHelper.image(Images.addBlue)}
                onClick={() => _openDrawer(TypesDialogType.location)}
              />
            </div>
            {locations.map((l) => (
              <div
                className="w-72 cursor-pointer group mb-6"
                key={`location-${l.id}`}
              >
                <img
                  className="w-4"
                  src={ImageHelper.image(Images.delete)}
                  onClick={() =>
                    setDeleteOpen({
                      open: true,
                      data: { type: TypesDialogType.location, id: l.id },
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
        <div className="flex flex-col w-[22rem] h-80 overflow-auto pl-3 mt-12">
          <div className="flex flex-row items-center justify-between w-full mb-8 pr-4">
            <span className="text-dark_blue font-bold text-xl">Statuses</span>
            <img
              className="w-6 h-6 cursor-pointer"
              src={ImageHelper.image(Images.addBlue)}
              onClick={() => _openDrawer(TypesDialogType.status)}
            />
          </div>
          {statuses.map((s) => (
            <div
              className="w-72 cursor-pointer group mb-6"
              key={`status-${s.id}`}
            >
              <img
                className="w-4"
                src={ImageHelper.image(Images.delete)}
                onClick={() =>
                  setDeleteOpen({
                    open: true,
                    data: { type: TypesDialogType.status, id: s.id },
                  })
                }
              />
              <div className="bg-white shadow-lg h-10 w-72 group-hover:translate-x-8 transition-all rounded-lg px-4 flex flex-col justify-center relative mt-[-1.8rem]">
                <span className="font-medium text-sm text-dark_blue">
                  {toFirstUpperCase(s.displayName ?? "")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
