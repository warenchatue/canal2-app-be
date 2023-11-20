import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { clone } from 'lodash';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';
import { OrgsService } from './orgs.service';

export const GROUP_CREATED_EVENT = 'groups.create';
export const GROUP_UPDATED_EVENT = 'groups.updated';

@Injectable()
export class GroupsHandler {
  private logger: Logger = new Logger(GroupsHandler.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly orgsService: OrgsService,
    private readonly usersService: UsersService,
  ) {}

  @OnEvent(GROUP_CREATED_EVENT)
  async groupCreateSucceedHandler(org) {
    try {
    } catch (error) {
      this.logger.error(error);
    }
  }

  async _d(data) {
    const d = clone(data);
    if (d.account) {
      const user = await this.usersService.findOne(d.account);
      d['memberName'] = `${user.firstName} ${user.lastName}`;
      d['memberPhone'] = user.phone;
    }

    return d;
  }
}
