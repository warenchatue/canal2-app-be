import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { clone } from 'lodash';
import {
  NotificationLevel,
  NotificationType,
} from '../../notifications/entities/notification.entity';
import { NotificationsService } from '../../notifications/notifications.service';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

export const ORDER_CREATED_EVENT = 'invoice.create';

@Injectable()
export class InvoicesHandler {
  private readonly logger: Logger = new Logger(InvoicesHandler.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  @OnEvent(ORDER_CREATED_EVENT)
  async handleInvoiceCreated(data) {
    try {
      const notif = await this.notificationsService.create({
        type: NotificationType.newInvoice,
        level: NotificationLevel.info,
        data: await this._d(data),
      });
      // await this.orgsService.pushNotification(data.orgId, notif._id);

      this.logger.log(`${ORDER_CREATED_EVENT} event triggered`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async _d(data) {
    const d = clone(data);
    if (d.accountId) {
      const user = (await this.usersService.findOne(d.accountId)) as User;
      d['memberName'] = `${user.firstName} ${user.lastName}`;
      d['memberEmail'] = user.email;
    }

    return d;
  }
}
