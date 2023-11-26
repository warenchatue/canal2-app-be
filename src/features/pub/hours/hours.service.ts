import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { CreateHourDto } from './dto/create-hour.dto';
import { UpdateHourDto } from './dto/update-hour.dto';
import { Hour, HourDocument } from './entities/hour.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class HoursService extends DeletableMixin<Hour> {
  constructor(
    @InjectModel(Hour.name)
    private readonly hours: Model<HourDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateHourDto) {
    return this.hours.create({
      ...dto,
    });
  }

  findByName(name: string) {
    return this.hours.findOne({ name }).exec();
  }

  findOne(_id: string) {
    return this.hours.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return this.hours.find().where('state').in(states).exec();
  }

  findAll() {
    return this.hours.find();
  }

  async update(_id: string, dto: UpdateHourDto) {
    return await this.hours
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }

  async pushNotification(_id: string, notificationId: string) {
    const result = await this.hours
      .findByIdAndUpdate(_id, {
        $push: { notifications: notificationId },
      })
      .orFail()
      .exec();

    // this.event.emit(NOTIFICATION_PUSH_EVENT, { notificationId, topic: _id });
    return result;
  }
}
