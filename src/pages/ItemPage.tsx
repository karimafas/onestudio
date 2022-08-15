import {
  Breadcrumbs,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  Link,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  FormContainer,
  SelectElement,
  TextFieldElement,
} from "react-hook-form-mui";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { SubmittedData } from "../components/AddDrawer";
import ConfirmDialog from "../components/ConfirmDialog";
import { deleteDataItem, reloadItem } from "../features/data/dataSlice";
import { deleteItems, updateItem } from "../features/data/inventorySlice";
import { InventoryItem, ItemStatus } from "../objects/InventoryItem";
import "./ItemPage.css";
import BentoIcon from "@mui/icons-material/Bento";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import { EventSubmittedData, FaultDrawer } from "../components/FaultDrawer";
import { ApiHelper } from "../helpers/ApiHelper";
import { TimelineCard } from "./TimelineCard";
import "../App.css";
import { StatusCard } from "../components/StatusCard";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { Category } from "../objects/Category";
import { StudioLocation } from "../objects/StudioLocation";
import { Owner } from "../objects/Owner";

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
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const categories: Array<Category> = useAppSelector(
    (state) => state.data.categories
  );
  const locations: Array<StudioLocation> = useAppSelector(
    (state) => state.data.locations
  );
  const owners: Array<Owner> = useAppSelector((state) => state.data.owners);

  useEffect(() => {
    if (item && item.events && item.events.length === 0) {
      item.initEvents().then((_) => {
        setLoadingTimeline(false);
      });
    } else {
      setLoadingTimeline(false);
    }

    if (item && item.createdBy) {
      item.loadUser().then((_) => {
        setLoadingUser(false);
      });
    }
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

  async function _updateItem(data: SubmittedData) {
    setDisabled(true);

    const _item: InventoryItem = new InventoryItem(
      id,
      data.manufacturer,
      data.model,
      parseInt(data.locationId),
      data.serial,
      data.mNumber,
      parseFloat(data.price),
      parseInt(data.categoryId),
      parseInt(data.ownerId),
      data.notes,
      new Date(),
      new Date(),
      ItemStatus.working,
      0
    );

    const result = await dispatch(updateItem(_item));
    if (result.payload) {
      await dispatch(reloadItem(item.id));
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

  if (!item) {
    return <div></div>;
  } else {
    const initialValues: SubmittedData = {
      manufacturer: item.manufacturer,
      model: item.model,
      locationId: item.locationId.toString(),
      categoryId: item.categoryId.toString(),
      ownerId: item.ownerId.toString(),
      serial: item.serial,
      price: item.price.toString(),
      mNumber: item.mNumber,
      notes: item.notes,
    };

    return (
      <div>
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
        <FormContainer
          key="update-item-form"
          defaultValues={initialValues}
          onSuccess={(data: SubmittedData) => {
            _updateItem(data);
          }}
        >
          <ConfirmDialog
            title="Delete Item"
            body="Are you sure you want to delete this item?"
            open={deleteOpen}
            setOpen={() => setDeleteOpen(!deleteOpen)}
            onConfirm={_delete}
          />
          <div className="item-page__wrapper">
            <div className="item-page__title-wrapper">
              <div className="item-page__row item-page__row--sb">
                <Breadcrumbs aria-label="breadcrumb">
                  <Link
                    underline="hover"
                    sx={{ display: "flex", alignItems: "center" }}
                    color="inherit"
                    href="/inventory"
                  >
                    <BentoIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Inventory
                  </Link>
                  <Typography
                    sx={{ display: "flex", alignItems: "center" }}
                    color="text.primary"
                  >
                    <LibraryMusicIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    {item.manufacturer} {item.model}
                  </Typography>
                </Breadcrumbs>
                <div className="item-page__row">
                  <Button
                    color="error"
                    sx={{ marginRight: "1em" }}
                    onClick={() => setDeleteOpen(true)}
                  >
                    <DeleteIcon
                      fontSize="small"
                      sx={{ marginRight: "0.3em" }}
                    />
                    Delete Item
                  </Button>
                  <Button
                    sx={{ marginRight: "1em" }}
                    onClick={() => setDrawer(true)}
                  >
                    {item.status === ItemStatus.faulty ? (
                      <AutoFixHighIcon
                        fontSize="small"
                        sx={{ marginRight: "0.3em" }}
                      />
                    ) : (
                      <HeartBrokenIcon
                        fontSize="small"
                        sx={{ marginRight: "0.3em" }}
                      />
                    )}
                    {item.status === ItemStatus.faulty
                      ? "Report Fix"
                      : "Report Fault"}
                  </Button>
                  <Button type="submit">
                    <SaveIcon fontSize="small" sx={{ marginRight: "0.3em" }} />
                    Save Item
                  </Button>
                </div>
              </div>
            </div>
            <div className="item-page__body-wrapper">
              <div className="item-page__row">
                <div className="item-page__col">
                  <span className="item-page__title">Details</span>
                  <div className="item-page__row">
                    <TextFieldElement
                      name="manufacturer"
                      disabled={disabled}
                      style={{ marginBottom: "1em" }}
                      label="Manufacturer"
                      required
                      className="item-page__input"
                      sx={{ marginRight: "2em" }}
                    />
                    <TextFieldElement
                      name="model"
                      disabled={disabled}
                      style={{ marginBottom: "1em" }}
                      label="Model"
                      required
                      className="item-page__input"
                    />
                  </div>
                  <div className="item-page__row">
                    <SelectElement
                      className="item-page__input"
                      sx={{ marginRight: "2em" }}
                      style={{ marginBottom: "1em" }}
                      label="Category"
                      name="categoryId"
                      options={categories.map((c) => {
                        return { id: `${c.id}`, label: c.name };
                      })}
                      required
                    />
                    <TextFieldElement
                      name="price"
                      disabled={disabled}
                      style={{ marginBottom: "1em" }}
                      label="Price"
                      required
                      className="item-page__input"
                      InputProps={{
                        endAdornment: "£",
                      }}
                    />
                  </div>
                  <div className="item-page__row">
                    <TextFieldElement
                      name="serial"
                      disabled={disabled}
                      style={{ marginBottom: "1em" }}
                      label="Serial #"
                      required
                      className="item-page__input"
                      sx={{ marginRight: "2em" }}
                    />
                    <TextFieldElement
                      name="mNumber"
                      disabled={disabled}
                      style={{ marginBottom: "1em" }}
                      label="M-Number"
                      required
                      className="item-page__input"
                    />
                  </div>
                  <div className="item-page__row">
                    <SelectElement
                      className="item-page__input"
                      sx={{ marginRight: "2em" }}
                      style={{ marginBottom: "1em" }}
                      label="Owner"
                      name="ownerId"
                      options={owners.map((o) => {
                        return { id: `${o.id}`, label: o.name };
                      })}
                      required
                    />
                    <SelectElement
                      className="item-page__input"
                      style={{ marginBottom: "1em" }}
                      label="Location"
                      name="locationId"
                      options={locations.map((l) => {
                        return { id: `${l.id}`, label: l.name };
                      })}
                      required
                    />
                  </div>
                  <div className="item-page__row">
                    <TextFieldElement
                      name="notes"
                      disabled={disabled}
                      style={{ marginBottom: "1em" }}
                      label="Notes"
                      className="item-page__input--lrg"
                    />
                  </div>
                  <div className="flex-row ai-center">
                    <span className="mr-05em font-bold">Item Status: </span>
                    <StatusCard status={item.status} />
                  </div>
                  {loadingUser ? (
                    <div></div>
                  ) : (
                    <>
                      <span className="item-page__notes mt-1em">
                        {`Created on ${item.createdAtStr} by ${
                          item.user?.firstName ?? ""
                        } ${item.user?.lastName ?? ""}.`}
                      </span>
                      <span className="item-page__notes">
                        {`Last updated on ${item.updatedAtStr} by ${
                          item.user?.firstName ?? ""
                        } ${item.user?.lastName ?? ""}.`}
                      </span>
                    </>
                  )}
                </div>
                <Divider
                  orientation="vertical"
                  sx={{ marginLeft: "4em", marginRight: "2em" }}
                />
                {loadingTimeline ? (
                  <div className="item-page__timeline-loading">
                    <CircularProgress />
                  </div>
                ) : (
                  <div className="item-page__timeline-wrapper">
                    <div className="item-page__col--timeline">
                      <span className="item-page__title">Timeline</span>
                      {item.events.map((e, index) => (
                        <TimelineCard key={e.id} event={e} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </FormContainer>
      </div>
    );
  }
}
