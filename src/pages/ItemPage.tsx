import { Breadcrumbs, Button, Divider, Link, Typography } from "@mui/material";
import { useState } from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { SubmittedData } from "../components/AddDrawer";
import ConfirmDialog from "../components/ConfirmDialog";
import { deleteDataItem, reloadItem } from "../features/data/dataSlice";
import { deleteItems, updateItem } from "../features/data/inventorySlice";
import { InventoryItem } from "../objects/InventoryItem";
import "./ItemPage.css";
import BentoIcon from "@mui/icons-material/Bento";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import { TimelineCard } from "./TimelineCard";
import { Logger } from "../services/logger";

function useForceUpdate() {
  const [value, setValue] = useState(0);
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

  async function _submit(data: SubmittedData) {
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
      new Date()
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
      <FormContainer
        defaultValues={initialValues}
        onSuccess={(data: SubmittedData) => _submit(data)}
      >
        <ConfirmDialog
          title="Delete Item"
          body="Are you sure you want to delete this item?"
          open={deleteOpen}
          setOpen={() => setDeleteOpen(!deleteOpen)}
          onConfirm={_delete}
        />
        <div className="item-page__wrapper">
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
                Delete Item
              </Button>
              <Button type="submit">Save Item</Button>
            </div>
          </div>
          <Divider sx={{ marginBottom: "3em", marginTop: "1em" }} />
          <div className="item-page__row item-page__row">
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
                <TextFieldElement
                  name="categoryId"
                  disabled={disabled}
                  style={{ marginBottom: "1em" }}
                  label="Category"
                  required
                  className="item-page__input"
                  sx={{ marginRight: "2em" }}
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
                <TextFieldElement
                  name="ownerId"
                  disabled={disabled}
                  style={{ marginBottom: "1em" }}
                  label="Owner"
                  required
                  className="item-page__input"
                  sx={{ marginRight: "2em" }}
                />
                <TextFieldElement
                  name="locationId"
                  disabled={disabled}
                  style={{ marginBottom: "1em" }}
                  label="Location"
                  required
                  className="item-page__input"
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
              <span className="item-page__notes">
                {`Created on ${item.createdAtStr} by Karim Afas.`}
              </span>
              <span className="item-page__notes">
                {`Last updated on ${item.updatedAtStr} by Karim Afas.`}
              </span>
            </div>
            <Divider
              orientation="vertical"
              sx={{ marginLeft: "4em", marginRight: "4em" }}
            />
            <div className="item-page__col">
              <span className="item-page__title">Timeline</span>
              {item.events.map((e) => (
                <TimelineCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        </div>
      </FormContainer>
    );
  }
}
