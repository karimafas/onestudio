import { Card, CardContent, Divider } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import "./TimelineCard.css";
import { TimelineEvent, TimelineEventType } from "../objects/TimelineEvent";
import moment from "moment";
import { Constants } from "../utils/Constants";
import { HeartBroken } from "@mui/icons-material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

function getText(type: TimelineEventType): string {
  switch (type) {
    case TimelineEventType.created:
      return "Created item";
    case TimelineEventType.edited:
      return "Edited item";
    case TimelineEventType.fault:
      return "Fault reported";
    case TimelineEventType.fix:
      return "Fix reported";
  }
}

function getIcon(type: TimelineEventType) {
  const _sx = { color: "white", marginRight: "0.4em", fontSize: "1.1em" };
  switch (type) {
    case TimelineEventType.created:
      return <NoteAddIcon sx={_sx} />;
    case TimelineEventType.edited:
      return <ModeEditIcon sx={_sx} />;
    case TimelineEventType.fault:
      return <HeartBroken sx={_sx} />;
    case TimelineEventType.fix:
      return <AutoFixHighIcon sx={_sx} />;
  }
}

function getBackground(type: TimelineEventType): string {
  switch (type) {
    case TimelineEventType.created:
      return "timeline-card--nrm-bg";
    case TimelineEventType.edited:
      return "timeline-card--nrm-bg";
    case TimelineEventType.fix:
      return "timeline-card--fix-bg";
    case TimelineEventType.fault:
      return "timeline-card--fault-bg";
  }
}

export function TimelineCard(props: { event: TimelineEvent }) {
  return (
    <Card
      className={`timeline-card__wrapper ${getBackground(props.event.type)}`}
    >
      <CardContent
        sx={{
          "&:last-child": {
            pb:
              props.event.type === TimelineEventType.fault ||
              props.event.type === TimelineEventType.fix
                ? 1.5
                : 2,
          },
        }}
      >
        <div className="timeline-card__row">
          <AccessTimeIcon
            sx={{ color: "white", fontSize: "0.8em", marginRight: "0.3em" }}
          />
          <span className="timeline-card__datetime">
            {moment(props.event.createdAt).format(Constants.dateTimeFormat)} by 
             {` ${props.event.user?.firstName}` ?? ""}{" "}
            {props.event.user?.lastName ?? ""}
          </span>
        </div>
        <div className="timeline-card__row time-card__mt1">
          {getIcon(props.event.type)}
          <span className="timeline-card__title">
            {getText(props.event.type)}
          </span>
        </div>
        {props.event.notes ? (
          <Divider sx={{ marginTop: "0.5em", marginBottom: "0.5em" }} />
        ) : (
          <div></div>
        )}
        {props.event.notes ? (
          <span className="timeline-card__datetime">{props.event.notes}</span>
        ) : (
          <div></div>
        )}
      </CardContent>
    </Card>
  );
}
