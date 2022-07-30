import { Box, Button } from "@mui/material";
import "./AddDrawer.css";
import AddBoxIcon from "@mui/icons-material/AddBox";
import React from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";

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

  return (
    <div>
      <FormContainer
        onSuccess={async (data: SubmittedData) => {
          setDisabled(true);
          await props.submit(data);
          setDisabled(false);
        }}
      >
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
