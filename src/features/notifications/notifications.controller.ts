import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Put,
  Req,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { sendError } from 'src/common/helpers';
import { UseJwt } from '../auth/auth.decorator';
import { UsersService } from '../users/users.service';
import { AddViewerDto } from './dto/add-viewer.dto';
import { updateNotificationCompletedDto } from './dto/update-notifiaction-completed.dto';
import { UpdateNotificationVisibility } from './dto/update-notification-visibility.dto';
import { NOTIFICATION_VIEW_EVENT } from './notifiactions.handler';
import { NotificationsService } from './notifications.service';

@ApiBearerAuth()
@ApiTags('Notifications')
@UseJwt()
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly accountsService: UsersService,
    private readonly event: EventEmitter2,
  ) {}

  @Get()
  getAllNotifications(@Req() req) {
    return this.notificationsService
      .findAll()
      .then((result) => result)
      .catch((error) => {
        throw new HttpException(error, 500);
      });
  }

  @Get()
  getNotificationsByUser(@Req() req) {
    return this.accountsService
      .findNotifications(req.user._id)
      .then((result) => result.notifications)
      .catch((error) => {
        throw new HttpException(error, 500);
      });
  }

  @Put(':notificationId/viewers')
  async addViewer(
    @Param('notificationId') notificationId: string,
    @Body() { viewer }: AddViewerDto,
  ) {
    try {
      const result = await this.notificationsService.addViewer(
        notificationId,
        viewer,
      );
      this.event.emit(NOTIFICATION_VIEW_EVENT, {
        accountId: viewer,
        notificationId,
      });
      return result;
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':notificationId/display')
  async updateNotificationVisibility(
    @Param('notificationId') notificationId: string,
    @Body() { display }: UpdateNotificationVisibility,
  ) {
    try {
      return await this.notificationsService.updateVisibility(
        notificationId,
        display,
      );
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':notificationId/completed')
  async updateNotificationCompletion(
    @Param('notificationId') notificationId: string,
    @Body() { completed }: updateNotificationCompletedDto,
  ) {
    try {
      return await this.notificationsService.updateCompleted(
        notificationId,
        completed,
      );
    } catch (error) {
      sendError(error);
    }
  }
}
