import { Box, Button } from "@mui/material";
import "./AddDrawer.css";
import {
  FormContainer,
  SelectElement,
  TextFieldElement,
} from "react-hook-form-mui";
import DataSaverOnIcon from "@mui/icons-material/DataSaverOn";
import { useState } from "react";
import { useAppSelector } from "../app/hooks";
import { SetOwnerType } from "../helpers/ApiHelper";

export enum TypesDrawerType {
  category,
  location,
  owner,
}

export interface TypesSubmittedData {
  name: string | undefined;
  userId: number | undefined;
  setOwnerType: SetOwnerType;
}

export function TypesDrawer(props: {
  submit: Function;
  type: TypesDrawerType;
}) {
  const users = useAppSelector((state) =>
    state.data.studioUsers.filter((u) => !u.owner)
  );
  const [disabled, setDisabled] = useState(false);

  return (
    <div>
      <FormContainer
        onSuccess={async (data: TypesSubmittedData) => {
          data.setOwnerType = SetOwnerType.grant;
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
                    : props.type === TypesDrawerType.location
                    ? "location"
                    : "owner"}
                </span>
              </div>
              {props.type === TypesDrawerType.owner ? (
                <SelectElement
                  size="small"
                  style={{ marginBottom: "1em" }}
                  label="User"
                  name="userId"
                  options={users.map((u) => {
                    return { id: `${u.id}`, label: u.email };
                  })}
                  required
                />
              ) : (
                <TextFieldElement
                  name="name"
                  disabled={disabled}
                  style={{ marginBottom: "1em" }}
                  size="small"
                  label="Name"
                  required
                />
              )}
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
                  : props.type === TypesDrawerType.location
                  ? "Location"
                  : "Owner"}
              </Button>
            </div>
          </div>
        </Box>
      </FormContainer>
    </div>
  );
}
