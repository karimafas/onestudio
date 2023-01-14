import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Category } from "../objects/Category";
import { StudioLocation } from "../objects/StudioLocation";
import { useState } from "react";
import { reloadTypes } from "../features/data/dataSlice";
import ConfirmDialog from "../components/ConfirmDialog";
import { Header } from "../components/Header";
import { StudioInfoCard } from "../components/StudioInfoCard";
import { TypesRepository } from "../repositories/TypesRepository";
import DeleteIcon from "@mui/icons-material/Delete";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { AddTypesDialog, TypesDialogType } from "../components/AddTypesDialog";
import { Status } from "../objects/Status";
import { StringHelper } from "../helpers/StringHelper";
import { StatusRepository } from "../repositories/StatusRepository";

export interface TypesSubmittedData {
  name: string;
}

export function SettingsPage() {
  const [dialog, setDialog] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<TypesDialogType>(
    TypesDialogType.category
  );
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
  const dispatch = useAppDispatch();

  function _openDrawer(type: TypesDialogType) {
    setDialogType(type);
    setDialog(true);
  }

  async function _submit(data: TypesSubmittedData) {
    let success = false;

    if (!data.name) return;

    if (dialogType === TypesDialogType.status) {
      success = await StatusRepository.createStatus(data.name);
    } else {
      success = await TypesRepository.createType(data.name, dialogType);
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

    if (type === TypesDialogType.status) {
      success = await StatusRepository.deleteStatus(id!);
    } else {
      success = await TypesRepository.deleteType(id!, type!);
    }

    if (success) {
      await dispatch(reloadTypes());
    }
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
          <div className="flex flex-col w-[22rem] h-80 ml-40 overflow-auto pl-3">
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
                  {StringHelper.toFirstUpperCase(s.name)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
