import { Card, CardContent } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import "./TimelineCard.css";
import { TimelineEvent, TimelineEventType } from "../objects/TimelineEvent";

function getText(type: TimelineEventType) {
  switch (type) {
    case TimelineEventType.created:
      return "Created item";
    case TimelineEventType.edited:
      return "Edited item";
  }
}

function getIcon(type: TimelineEventType) {
  const _sx = { color: "white", marginRight: "0.4em", fontSize: "1.1em" };
  switch (type) {
    case TimelineEventType.created:
      return <NoteAddIcon sx={_sx} />;
    case TimelineEventType.edited:
      return <ModeEditIcon sx={_sx} />;
  }
}

export function TimelineCard(props: { event: TimelineEvent }) {
  return (
    <Card sx={{ borderRadius: "0.5em" }} className="timeline-card__wrapper">
      <CardContent>
        <div className="timeline-card__row">
          <AccessTimeIcon
            sx={{ color: "white", fontSize: "0.8em", marginRight: "0.3em" }}
          />
          <span className="timeline-card__datetime">
            29 Jul 2022, 20:27 by Karim Afas
          </span>
        </div>
        <div className="timeline-card__row time-card__mt1">
          {getIcon(props.event.type)}
          <span className="timeline-card__title">
            {getText(props.event.type)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
