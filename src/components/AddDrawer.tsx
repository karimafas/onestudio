import { Box, Button } from "@mui/material";
import "./AddDrawer.css";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { InventoryItem } from "../objects/InventoryItem";
import { useAppDispatch } from "../app/hooks";
import { createItem, setDrawer } from "../features/data/inventorySlice";
import React from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { initialLoad } from "../features/data/dataSlice";

export interface SubmittedData {
  manufacturer: string;
  model: string;
  locationId: string;
  serial: string;
  mNumber: string;
  price: string;
  categoryId: string;
  ownerId: string;
  notes: string;
}

export function AddDrawer() {
  const dispatch = useAppDispatch();
  const [disabled, setDisabled] = React.useState(false);

  async function submit(data: SubmittedData) {
    console.log(data);
    setDisabled(true);

    const item: InventoryItem = new InventoryItem(
      0,
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

    const result = await dispatch(createItem(item));

    if (result) {
      dispatch(setDrawer(false));
      dispatch(initialLoad());
    }

    setDisabled(false);
  }

  return (
    <div>
      <FormContainer onSuccess={(data: SubmittedData) => submit(data)}>
        <Box className="add-drawer__wrapper" role="presentation">
          <div className="add-drawer__col add-drawer__col--space-btwn">
            <div className="add-drawer__col add-drawer__col--padded">
              <div className="add-drawer__row">
                <AddBoxIcon />
                <span className="add-drawer__title">Add new item</span>
              </div>
              <TextFieldElement
                name="manufacturer"
                disabled={disabled}
                style={{ marginBottom: "1em" }}
                size="small"
                label="Manufacturer"
                required
              />
              <TextFieldElement
                name="model"
                disabled={disabled}
                style={{ marginBottom: "1em" }}
                size="small"
                label="Model"
                required
              />
              <TextFieldElement
                name="categoryId"
                disabled={disabled}
                style={{ marginBottom: "1em" }}
                size="small"
                label="Category"
                required
              />
              <TextFieldElement
                name="price"
                disabled={disabled}
                style={{ marginBottom: "1em" }}
                size="small"
                label="Price"
                required
              />
              <TextFieldElement
                name="serial"
                disabled={disabled}
                style={{ marginBottom: "1em" }}
                size="small"
                label="Serial #"
                required
              />
              <TextFieldElement
                name="mNumber"
                disabled={disabled}
                style={{ marginBottom: "1em" }}
                size="small"
                label="M-Number"
                required
              />
              <TextFieldElement
                name="ownerId"
                disabled={disabled}
                style={{ marginBottom: "1em" }}
                size="small"
                label="Owner"
                required
              />
              <TextFieldElement
                name="locationId"
                disabled={disabled}
                style={{ marginBottom: "1em" }}
                size="small"
                label="Location"
                required
              />
              <TextFieldElement
                name="notes"
                disabled={disabled}
                style={{ marginBottom: "1em" }}
                size="small"
                label="Notes"
              />
            </div>
            <div className="add-drawer__row add-drawer__row--end">
              <Button
                type={"submit"}
                sx={{ marginRight: "2em" }}
                size="small"
                variant="contained"
              >
                Create Item
              </Button>
            </div>
          </div>
        </Box>
      </FormContainer>
    </div>
  );
}
