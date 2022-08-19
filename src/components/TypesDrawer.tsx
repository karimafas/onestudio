import { Box, Button } from "@mui/material";
import "./AddDrawer.css";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import DataSaverOnIcon from "@mui/icons-material/DataSaverOn";
import { useState } from "react";

export enum TypesDrawerType {
  category,
  location,
}

export interface TypesSubmittedData {
  name: string;
}

export function TypesDrawer(props: {
  submit: Function;
  type: TypesDrawerType;
}) {
  const [disabled, setDisabled] = useState(false);

  return (
    <div>
      <FormContainer
        onSuccess={async (data: TypesSubmittedData) => {
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
                <span className="add-drawer__title">
                  Add new{" "}
                  {props.type === TypesDrawerType.category
                    ? "category"
                    : "location"}
                </span>
              </div>
              <TextFieldElement
                name="name"
                disabled={disabled}
                style={{ marginBottom: "1em" }}
                size="small"
                label="Name"
                required
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
                Add{" "}
                {props.type === TypesDrawerType.category
                  ? "Category"
                  : "Location"}
              </Button>
            </div>
          </div>
        </Box>
      </FormContainer>
    </div>
  );
}
