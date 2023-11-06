import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country, CountryDocument } from './entities/country.entity';
// import { NOTIFICATION_PUSH_EVENT } from '../notifications/notifiactions.handler';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CountriesService extends DeletableMixin<Country> {
  constructor(
    @InjectModel(Country.name)
    private readonly roles: Model<CountryDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateCountryDto) {
    return this.roles.create({
      ...dto,
    });
  }

  findByName(name: string) {
    return this.roles.findOne({ name }).exec();
  }

  findOne(_id: string) {
    return this.roles.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return this.roles.find().where('state').in(states).exec();
  }

  findAll() {
    return this.roles.find();
  }

  async update(_id: string, dto: UpdateCountryDto) {
    return await this.roles
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }

  async pushNotification(_id: string, notificationId: string) {
    const result = await this.roles
      .findByIdAndUpdate(_id, {
        $push: { notifications: notificationId },
      })
      .orFail()
      .exec();

    // this.event.emit(NOTIFICATION_PUSH_EVENT, { notificationId, topic: _id });
    return result;
  }
}
