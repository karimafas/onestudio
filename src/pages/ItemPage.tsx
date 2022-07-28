import {
  Breadcrumbs,
  Button,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import React from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { SubmittedData } from "../components/AddDrawer";
import { updateItem } from "../features/data/inventorySlice";
import { InventoryItem } from "../objects/InventoryItem";
import "./ItemPage.css";

export function ItemPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const id = parseInt(params["id"] ?? "0");
  const item = useAppSelector(
    (state) => state.data.items.filter((i) => i.id === id)[0]
  );
  const [disabled, setDisabled] = React.useState<boolean>(false);

  async function submit(data: SubmittedData) {
    setDisabled(true);

    const item: InventoryItem = new InventoryItem(
      id,
      data.manufacturer,
      data.model,
      parseInt(data.locationId),
      data.serial,
      data.mNumber,
      parseFloat(data.price),
      parseInt(data.categoryId),
      parseInt(data.ownerId),
      data.notes
    );

    await dispatch(updateItem(item));
    setDisabled(false);
  }

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
      onSuccess={(data: SubmittedData) => submit(data)}
    >
      <div className="item-page__wrapper">
        <div className="item-page__row item-page__row--sb">
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/inventory">
              Inventory
            </Link>
            <Typography color="text.primary">{item.model}</Typography>
          </Breadcrumbs>
          <div className="item-page__row">
            <Button color="error" sx={{ marginRight: "1em" }}>
              Delete Item
            </Button>
            <Button type="submit">Save Item</Button>
          </div>
        </div>
        <Divider sx={{ marginBottom: "3em", marginTop: "1em" }} />
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
            required
            className="item-page__input--lrg"
          />
        </div>
        <span className="item-page__notes">
          Created on 28 Jul 2022 by Karim Afas.
        </span>
        <span className="item-page__notes">
          Last updated on 28 Jul 2022 by Karim Afas.
        </span>
      </div>
    </FormContainer>
  );
}
