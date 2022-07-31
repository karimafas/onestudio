import { ItemStatus } from "../objects/InventoryItem";
import "./StatusCard.css";

function getText(status: ItemStatus) {
  switch (status) {
    case ItemStatus.faulty:
      return "Faulty";
    case ItemStatus.working:
      return "Working";
  }
}

function getBackgroundClass(status: ItemStatus) {
  switch (status) {
    case ItemStatus.working:
      return "status-card__working-bg";
    case ItemStatus.faulty:
      return "status-card__faulty-bg";
  }
}

function getIndicatorClass(status: ItemStatus) {
  switch (status) {
    case ItemStatus.working:
      return "status-card__working-ind";
    case ItemStatus.faulty:
      return "status-card__faulty-ind";
  }
}

export function StatusCard(props: { status: ItemStatus }) {
  return (
    <div className={`status-card__wrapper ${getBackgroundClass(props.status)}`}>
      <div className={`status-card__indicator ${getIndicatorClass(props.status)}`}></div>
      <span className="status-card__txt">{getText(props.status)}</span>
    </div>
  );
}
