import { Injectable } from '@nestjs/common';
import { CreateAnnouncerDto } from './dto/create-announcer.dto';
import { Announcer, AnnouncerDocument } from './entities/announcer.entity';
import * as bcrypt from 'bcrypt';
import { UpdateAnnouncerDto } from './dto/update-announcer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { SALT_ROUND } from 'src/common/vars';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AnnouncersService extends DeletableMixin<Announcer> {
  constructor(
    @InjectModel(Announcer.name)
    private readonly announcers: Model<AnnouncerDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateAnnouncerDto) {
    return this.announcers.create({
      ...dto,
    });
  }

  findByEmail(email: string) {
    return this.announcers
      .findOne({ email })
      .populate([
        {
          path: 'country',
          model: 'Country',
        },
      ])
      .exec();
  }

  findByName(name: string) {
    return this.announcers.findOne({ name }).exec();
  }

  findOne(_id: string) {
    return this.announcers
      .findById(_id)
      .orFail()
      .populate([
        {
          path: 'country',
          model: 'Country',
        },
      ])
      .exec();
  }

  find(states = [State.active]) {
    return this.announcers
      .find()
      .where('state')
      .in(states)
      .populate([
        {
          path: 'country',
          model: 'Country',
        },
      ])
      .exec();
  }
  findLight(states = [State.active]) {
    return this.announcers
      .find({}, { name: 1 })
      .where('state')
      .in(states)
      .transform((docs) => {
        return docs.map((doc) => ({
          _id: doc._id.toString(),
          name: doc.name,
        }));
      })
      .exec();
  }

  findAll() {
    return this.announcers
      .find()
      .populate([
        {
          path: 'country',
          model: 'Country',
        },
      ])
      .exec();
  }

  async update(_id: string, dto: UpdateAnnouncerDto) {
    return await this.announcers
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }

  async pushNotification(_id: string, notificationId: string) {
    const result = await this.announcers
      .findByIdAndUpdate(_id, {
        $push: { notifications: notificationId },
      })
      .orFail()
      .exec();

    // this.event.emit(NOTIFICATION_PUSH_EVENT, { notificationId, topic: _id });
    return result;
  }

  findNotifications(_id: string) {
    return this.announcers
      .findById(_id)
      .select('notifications')
      .populate('notifications')
      .orFail()
      .exec();
  }

  resetPassword(phone: string, password: string) {
    return this.announcers
      .findOneAndUpdate(
        { phone },
        { $set: { password: bcrypt.hashSync(password, SALT_ROUND) } },
        { new: true },
      )
      .orFail()
      .exec();
  }

  async incrementOrgs(_id: string, value = 1) {
    const account = await this.announcers.findById(_id);
    account.packagesCount += value;
    return account.save();
  }

  async incrementNotificationsBulk(announcers: string[], value = 1) {
    return this.announcers.updateMany(
      { _id: { $in: announcers } },
      { $inc: { notificationsCount: value } },
    );
  }

  async incrementNotifications(_id: string, value = 1) {
    const account = await this.announcers.findById(_id).orFail();
    account.notificationsCount += value;
    return account.save();
  }

  countUnreadNotifications(_id: string) {
    return this.announcers.findById(_id).select('notificationsCount').exec();
  }

  updateAccount(_id: string, { email, phone }) {
    return this.announcers
      .findByIdAndUpdate(_id, { $set: { email, phone } })
      .orFail()
      .exec();
  }
}
