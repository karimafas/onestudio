import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import "./AddDrawer.css";
import React, { useState } from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import DataSaverOnIcon from "@mui/icons-material/DataSaverOn";
import { useAppSelector } from "../app/hooks";
import { Category } from "../objects/Category";
import { StudioLocation } from "../objects/StudioLocation";
import { Owner } from "../objects/Owner";

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

export function AddDrawer(props: { submit: Function }) {
  const [disabled, setDisabled] = React.useState(false);
  const categories: Array<Category> = useAppSelector(
    (state) => state.data.categories
  );
  const locations: Array<StudioLocation> = useAppSelector(
    (state) => state.data.locations
  );
  const owners: Array<Owner> = useAppSelector((state) => state.data.owners);
  const [categoryId, setCategory] = useState<number>(categories[0].id);
  const [locationId, setLocation] = useState<number>(locations[0].id);
  const [ownerId, setOwner] = useState<number>(owners[0].id);

  return (
    <div>
      <FormContainer
        onSuccess={async (data: SubmittedData) => {
          data.categoryId = categoryId.toString();
          data.locationId = locationId.toString();
          data.ownerId = ownerId.toString();
          setDisabled(true);
          await props.submit(data);
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
              <FormControl size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  defaultValue={categoryId}
                  sx={{ marginBottom: "1em" }}
                  size="small"
                  name="categoryId"
                  label="Category"
                  onChange={(event) => {
                    setCategory(event.target.value as number);
                  }}
                >
                  {categories.map((c) => (
                    <MenuItem value={c.id} key={`cat-${c.id}`}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              <FormControl size="small">
                <InputLabel>Owner</InputLabel>
                <Select
                  defaultValue={ownerId}
                  sx={{ marginBottom: "1em" }}
                  size="small"
                  name="ownerId"
                  label="Owner"
                  onChange={(event) => {
                    setOwner(event.target.value as number);
                  }}
                >
                  {owners.map((o) => (
                    <MenuItem value={o.id} key={`own-${o.id}`}>
                      {o.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small">
                <InputLabel>Location</InputLabel>
                <Select
                  defaultValue={locationId}
                  sx={{ marginBottom: "1em" }}
                  size="small"
                  name="locationId"
                  label="Location"
                  onChange={(event) => {
                    setLocation(event.target.value as number);
                  }}
                >
                  {locations.map((l) => (
                    <MenuItem value={l.id} key={`loc-${l.id}`}>
                      {l.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                Create Item
                <DataSaverOnIcon
                  fontSize="small"
                  sx={{ marginLeft: "0.3em" }}
                />
              </Button>
            </div>
          </div>
        </Box>
      </FormContainer>
    </div>
  );
}
