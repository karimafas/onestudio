import { Box, Button } from "@mui/material";
import "./FaultDrawer.css";
import React from "react";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import { InventoryItem, ItemStatus } from "../objects/InventoryItem";
import { TimelineEventType } from "../objects/TimelineEvent";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

export interface EventSubmittedData {
  itemId: number;
  type: TimelineEventType;
  notes: string;
}

export function FaultDrawer(props: { submit: Function; item: InventoryItem }) {
  const [disabled, setDisabled] = React.useState(false);

  return (
    <div>
      {/* <FormContainer
        key="add-fault-drawer"
        onSuccess={async (formData) => {
          const data: EventSubmittedData = {
            itemId: props.item.id,
            notes: formData.notes,
            type:
              props.item.status === ItemStatus.faulty
                ? TimelineEventType.fix
                : TimelineEventType.fault,
          };
          setDisabled(true);
          await props.submit(data);
          setDisabled(false);
        }}
      >
        <Box className="add-drawer__wrapper" role="presentation">
          <div className="add-drawer__col add-drawer__col--space-btwn">
            <div className="add-drawer__col add-drawer__col--padded">
              <div className="fault-drawer__row fault-drawer__row--mb">
                {props.item.status === ItemStatus.faulty ? (
                  <AutoFixHighIcon />
                ) : (
                  <HeartBrokenIcon />
                )}
                <span className="add-drawer__title">
                  {props.item.status === ItemStatus.faulty
                    ? "Report Fix"
                    : "Report Fault"}
                </span>
              </div>
              <div className="fault-drawer__row">
                <span className="fault-drawer__item-title">Model: </span>
                <span className="fault-drawer__item-body fault-drawer__item--ml">
                  {props.item.model}
                </span>
              </div>
              <div className="fault-drawer__row fault-drawer__row--mb">
                <span className="fault-drawer__item-title">Manufacturer: </span>
                <span className="fault-drawer__item-body fault-drawer__item--ml">
                  {props.item.manufacturer}
                </span>
              </div>
              <TextFieldElement
                name="notes"
                disabled={disabled}
                label="Notes"
                required
                multiline
                rows={3}
              />
            </div>
            <div className="add-drawer__row add-drawer__row--end">
              <Button
                type={"submit"}
                sx={{ marginRight: "2em" }}
                variant="outlined"
              >
                {props.item.status === ItemStatus.faulty ? (
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
                {props.item.status === ItemStatus.faulty
                  ? "Report Fix"
                  : "Report Fault"}
              </Button>
            </div>
          </div>
        </Box>
      </FormContainer> */}
    </div>
  );
}
