import { TimelineEvent, TimelineEventType } from "../objects/TimelineEvent";
import { LoggerService } from "../services/LoggerService";
import { RequestService, RequestType } from "../services/RequestService";

export class EventRepository {
  public static async getItemEvents(
    itemId: number
  ): Promise<Array<TimelineEvent>> {
    let events: Array<TimelineEvent> = [];

    try {
      const resp = await RequestService.request(
        `event/eventsForItem/${itemId}`,
        RequestType.get
      );

      const _events = resp.data;

      if (_events) {
        for (const event of _events) {
          const e = TimelineEvent.fromJson(event);
          events.push(e);
        }
      }
    } catch (e) {
      LoggerService.log(`Couldn't load items.`);
    }

    return events;
  }

  public static async getStudioEvents(): Promise<Array<TimelineEvent>> {
    let events: Array<TimelineEvent> = [];

    try {
      const resp = await RequestService.request(`event`, RequestType.get);

      const _events = resp.data;

      if (_events) {
        for (const event of _events) {
          const e = TimelineEvent.fromJson(event);
          events.push(e);
        }
      }
    } catch (e) {
      LoggerService.log(`Couldn't load items.`);
    }

    return events;
  }

  public static async createEvent(
    itemId: number,
    notes: string,
    eventType: TimelineEventType
  ): Promise<boolean> {
    let success = false;

    try {
      const body = {
        item_id: itemId,
        notes: notes,
        type: eventType,
      };

      const resp = await RequestService.request(
        "event",
        RequestType.post,
        body
      );

      if (resp.status === 201) {
        success = true;
        LoggerService.log("Created event.", resp.data);
      }
    } catch (e) {
      LoggerService.log("Couldn't create event.");
    }

    return success;
  }
}
