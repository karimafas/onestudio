import { LoggerService } from "../services/LoggerService";
import { RequestService, RequestType } from "../services/RequestService";
import { Notification } from "../objects/Notification";

export class NotificationRepository {
  public static async getNotifications(): Promise<Notification[]> {
    let notifications: Notification[] = [];

    try {
      const resp = await RequestService.request(
        "notification",
        RequestType.get
      );

      LoggerService.log("Loaded notifications from API.", resp);

      const _notifications = resp.data;

      if (_notifications) {
        for (const notification of _notifications) {
          notifications.push(Notification.fromJson(notification));
        }
      }
    } catch (e) {
      LoggerService.log(`Couldn't load notifications.`);
    }

    return notifications;
  }

  public static async viewNotification(notificationId: number): Promise<{
    success: boolean;
    notification: Notification | undefined;
  }> {
    let success = false;
    let notification: Notification | undefined;

    try {
      const body = { id: notificationId };
      const resp = await RequestService.request(
        "notification",
        RequestType.post,
        body
      );

      LoggerService.log("Updated notification to 'viewed'.", resp);

      notification = Notification.fromJson(resp.data);
      success = true;
    } catch (e) {
      LoggerService.log(`Couldn't update notification to 'viewed'.`);
    }

    return { success, notification };
  }
}
