import { Box, Button, TextField, Typography } from "@mui/material";
import "./ItemDrawer.css";
import DataSaverOnIcon from "@mui/icons-material/DataSaverOn";
import { useAppSelector } from "../app/hooks";
import { Category } from "../objects/Category";
import { StudioLocation } from "../objects/StudioLocation";
import { useState } from "react";
import { StudioUser } from "../objects/StudioUser";
import { ItemDfo, ItemStatus } from "../objects/InventoryItem";

export function ItemDrawer(props: { submit: Function }) {
  const [disabled, setDisabled] = useState(false);
  const categories: Category[] = useAppSelector(
    (state) => state.data.categories
  );
  const locations: StudioLocation[] = useAppSelector(
    (state) => state.data.locations
  );
  const owners: StudioUser[] = useAppSelector((state) =>
    state.data.studioUsers.filter((u) => u.owner)
  );
  const [priceError, setPriceError] = useState("");

  function validate(data: ItemDfo): boolean {
    if (/^\d{1,10}(\.\d{1,4})?$/.test(data.price)) {
      setPriceError("");
      return true;
    } else {
      setPriceError("Price must be a number.");
      return false;
    }
  }

  return (
    <div>
      {/* <FormContainer
        onSuccess={async (data: ItemDfo) => {
          setDisabled(true);
          if (validate(data)) {
            await props.submit(data);
          }
          setDisabled(false);
        }}
      >
        <Box className="add-drawer__wrapper" role="presentation">
          <div className="add-drawer__col add-drawer__col--space-btwn">
            <div className="add-drawer__col add-drawer__col--padded">
              <div className="add-drawer__row">
                <DataSaverOnIcon />
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
              <SelectElement
                size="small"
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
                size="small"
                label="Price"
                required
                error={true}
                helperText={priceError}
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
              <SelectElement
                size="small"
                style={{ marginBottom: "1em" }}
                label="Owner"
                name="ownerId"
                options={owners.map((o) => {
                  return {
                    id: `${o.id}`,
                    label: `${o.firstName} ${o.lastName} (${o.email})`,
                  };
                })}
                required
              />
              <SelectElement
                size="small"
                style={{ marginBottom: "1em" }}
                label="Location"
                name="locationId"
                options={locations.map((l) => {
                  return { id: `${l.id}`, label: l.name };
                })}
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
                variant="outlined"
              >
                <DataSaverOnIcon
                  fontSize="small"
                  sx={{ marginRight: "0.3em" }}
                />
                Create Item
              </Button>
            </div>
          </div>
        </Box>
      </FormContainer> */}
    </div>
  );
}
