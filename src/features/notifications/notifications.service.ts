import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  Notification,
  NotificationDocument,
} from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notifications: Model<NotificationDocument>,
  ) {}

  create(dto: CreateNotificationDto) {
    return this.notifications.create(dto);
  }

  findAll() {
    return this.notifications.find();
  }

  findOne(_id: string) {
    return this.notifications
      .findById(_id)
      .populate(['viewedBy'])
      .orFail()
      .exec();
  }

  addViewer(_id: string, accountId: string) {
    return this.notifications
      .findByIdAndUpdate(_id, { $push: { viewedBy: accountId } }, { new: true })
      .orFail()
      .exec();
  }

  updateVisibility(_id: string, display: boolean) {
    return this.notifications
      .findByIdAndUpdate(_id, { $set: { display } }, { new: true })
      .orFail()
      .exec();
  }

  updateCompleted(_id: string, value: boolean) {
    return this.notifications
      .findByIdAndUpdate(_id, { $set: { completed: value } }, { new: true })
      .orFail()
      .exec();
  }
}
