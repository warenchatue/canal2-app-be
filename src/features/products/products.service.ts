import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { State } from 'src/common/shared/base-schema';
import { SALT_ROUND } from 'src/common/vars';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './entities/product.entity';
import { ServiceDeleteAbstract } from 'src/common/abstracts/service-delete.abstract';

@Injectable()
export class ProductService extends ServiceDeleteAbstract<Product> {
  constructor(
    @InjectModel(Product.name)
    private readonly spots: Model<ProductDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateProductDto) {
    return this.spots.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.spots
      .findById(_id)
      .orFail()
      .populate([
        {
          path: 'package',
          model: 'OrderPackage',
        },
      ])
      .exec();
  }

  findActive(states = [State.active]) {
    return this.spots
      .find()
      .populate([
        {
          path: 'package',
          model: 'OrderPackage',
        },
      ])
      .where('state')
      .in(states)
      .exec();
  }

  findAll() {
    return this.spots.find().exec();
  }

  async update(_id: string, dto: UpdateProductDto) {
    return await this.spots
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }

  async pushNotification(_id: string, notificationId: string) {
    const result = await this.spots
      .findByIdAndUpdate(_id, {
        $push: { notifications: notificationId },
      })
      .orFail()
      .exec();

    // this.event.emit(NOTIFICATION_PUSH_EVENT, { notificationId, topic: _id });
    return result;
  }

  findNotifications(_id: string) {
    return this.spots
      .findById(_id)
      .select('notifications')
      .populate('notifications')
      .orFail()
      .exec();
  }

  resetPassword(phone: string, password: string) {
    return this.spots
      .findOneAndUpdate(
        { phone },
        { $set: { password: bcrypt.hashSync(password, SALT_ROUND) } },
        { new: true },
      )
      .orFail()
      .exec();
  }

  async incrementNotificationsBulk(spots: string[], value = 1) {
    return this.spots.updateMany(
      { _id: { $in: spots } },
      { $inc: { notificationsCount: value } },
    );
  }

  countUnreadNotifications(_id: string) {
    return this.spots.findById(_id).select('notificationsCount').exec();
  }

  updateAccount(_id: string, { email, phone }) {
    return this.spots
      .findByIdAndUpdate(_id, { $set: { email, phone } })
      .orFail()
      .exec();
  }
}
