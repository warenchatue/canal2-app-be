import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrgsService } from '../orgs/orgs.service';
import {
  NotificationLevel,
  NotificationType,
} from '../notifications/entities/notification.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';

export const TRANSACTION_CREATED_EVENT = 'transactions.create';
export const TRANSACTION_APPROUVED_EVENT = 'transactions.approuve';

@Injectable()
export class TransactionsHandler {
  private readonly logger: Logger = new Logger(TransactionsHandler.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly orgsService: OrgsService,
    private readonly usersService: UsersService,
  ) {}

  @OnEvent(TRANSACTION_CREATED_EVENT)
  async handleTransactionCreated({
    transactionId,
    authorId,
    projectsId,
    orgId,
  }) {
    try {
      const notification = await this.notificationsService.create({
        level: NotificationLevel.info,
        type: NotificationType.neutral,
        data: {
          transactionId,
          authorId,
          projectsId,
          orgId,
        },
      });

      await this.usersService.pushNotification(authorId, notification._id);

      if (orgId) {
        // await this.orgsService.pushNotification(orgId, notification._id);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
