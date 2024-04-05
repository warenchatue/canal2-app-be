import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { Supplier, SupplierDocument } from './entities/supplier.entity';
import * as bcrypt from 'bcrypt';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { SALT_ROUND } from 'src/common/vars';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SuppliersService extends DeletableMixin<Supplier> {
  constructor(
    @InjectModel(Supplier.name)
    private readonly suppliers: Model<SupplierDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateSupplierDto) {
    return this.suppliers.create({
      ...dto,
    });
  }

  findByEmail(email: string) {
    return this.suppliers
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
    return this.suppliers.findOne({ name }).exec();
  }

  findOne(_id: string) {
    return this.suppliers
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
    return this.suppliers
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
    return this.suppliers
      .find({}, { name: 1 })
      .where('state')
      .in(states)
      .transform((docs) => {
        return docs.map((doc) => ({
          _id: doc._id.toString(),
          id: doc._id.toString(),
          name: doc.name,
        }));
      })
      .exec();
  }

  findAll() {
    return this.suppliers
      .find()
      .populate([
        {
          path: 'country',
          model: 'Country',
        },
      ])
      .exec();
  }

  async update(_id: string, dto: UpdateSupplierDto) {
    return await this.suppliers
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }

  async pushNotification(_id: string, notificationId: string) {
    const result = await this.suppliers
      .findByIdAndUpdate(_id, {
        $push: { notifications: notificationId },
      })
      .orFail()
      .exec();
    // this.event.emit(NOTIFICATION_PUSH_EVENT, { notificationId, topic: _id });
    return result;
  }

  findNotifications(_id: string) {
    return this.suppliers
      .findById(_id)
      .select('notifications')
      .populate('notifications')
      .orFail()
      .exec();
  }

  resetPassword(phone: string, password: string) {
    return this.suppliers
      .findOneAndUpdate(
        { phone },
        { $set: { password: bcrypt.hashSync(password, SALT_ROUND) } },
        { new: true },
      )
      .orFail()
      .exec();
  }

  async incrementOrgs(_id: string, value = 1) {
    const account = await this.suppliers.findById(_id);
    account.packagesCount += value;
    return account.save();
  }

  async incrementNotificationsBulk(suppliers: string[], value = 1) {
    return this.suppliers.updateMany(
      { _id: { $in: suppliers } },
      { $inc: { notificationsCount: value } },
    );
  }

  async incrementNotifications(_id: string, value = 1) {
    const account = await this.suppliers.findById(_id).orFail();
    account.notificationsCount += value;
    return account.save();
  }

  countUnreadNotifications(_id: string) {
    return this.suppliers.findById(_id).select('notificationsCount').exec();
  }

  updateAccount(_id: string, { email, phone }) {
    return this.suppliers
      .findByIdAndUpdate(_id, { $set: { email, phone } })
      .orFail()
      .exec();
  }
}
