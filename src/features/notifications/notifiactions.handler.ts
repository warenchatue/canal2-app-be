import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from './notifications.service';
// import { getMessaging } from 'firebase-admin/messaging';

export const NOTIFICATION_VIEW_EVENT = 'notifications.view';
export const NOTIFICATION_PUSH_EVENT = 'notifications.push';
export const NOTIFICATION_PUSH_ANNOUNCEMENT_EVENT =
  'notifications.push.announcement';

export enum messageType {
  notification = 'notification',
  announcement = 'announcement',
}

@Injectable()
export class NotificationsHandler {
  private readonly logger: Logger = new Logger(NotificationsHandler.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  // @OnEvent(NOTIFICATION_VIEW_EVENT)
  // async handleNotificationView(data) {
  //   try {
  //     await this.accountsService.incrementNotifications(data.accountId, -1);
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw error;
  //   }
  // }

  @OnEvent(NOTIFICATION_PUSH_EVENT)
  async handleNotificationPush(data) {
    try {
      const { notificationId, topic } = data;
      const notification = await this.notificationsService.findOne(
        notificationId,
      );

      const _data = {
        messageType: messageType.notification,
        title: notification.type,
        memberName: notification.data['memberName'],
        memberPhone: notification.data['memberPhone'],
        orgId: topic,
      };

      // const response = await getMessaging().sendToTopic(`/topics/${topic}`, {
      //   data: _data,
      //   notification: { title: notification.type },
      // });

      // this.logger.log(response);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
