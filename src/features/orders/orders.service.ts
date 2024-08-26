import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceDeleteAbstract } from 'src/common/abstracts/service-delete.abstract';
import { USER_POPULATION } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './entities/order.entity';
import { State } from 'src/common/shared/base-schema';

@Injectable()
export class OrdersService extends ServiceDeleteAbstract<Order> {
  constructor(
    @InjectModel(Order.name)
    private readonly orders: Model<OrderDocument>,
  ) {
    super();
  }

  create(dto: CreateOrderDto, announcerId: string) {
    return this.orders.create({ ...dto, announcer: announcerId });
  }

  findOne(_id) {
    const population = [
      { path: 'creator', model: 'User' },
      { path: 'manager', model: 'User' },
      { path: 'announcer', model: 'Announcer' },
      { path: 'org', model: 'Org' },
      { path: 'package', model: 'Campaign' },
      { path: 'paymentMethod', model: 'PaymentMethod' },
      { path: 'paymentCondition', model: 'PaymentCondition' },
    ];
    return this.orders.findById(_id).orFail().populate(population).exec();
  }

  findOneNoPopulate(_id) {
    return this.orders.findById(_id).orFail().exec();
  }

  find(states: State[] = [State.active]) {
    const population = [
      { path: 'creator', model: 'User' },
      { path: 'manager', model: 'User' },
      { path: 'announcer', model: 'Announcer' },
      { path: 'org', model: 'Org' },
      { path: 'package', model: 'Campaign' },
      { path: 'paymentMethod', model: 'PaymentMethod' },
      { path: 'paymentCondition', model: 'PaymentCondition' },
    ];
    return this.orders
      .find()
      .populate(population)
      .where('state')
      .in(states)
      .exec();
  }

  findByAnnouncer(announcerId: string, states: State[] = [State.active]) {
    const population = [{ path: 'creator', ...USER_POPULATION }];
    return this.orders
      .find({ announcer: announcerId })
      .populate(population)
      .where('state')
      .in([states])
      .exec();
  }

  findLightByCode(states = [State.active], code: string) {
    const regex = new RegExp(code, 'i');
    return this.orders
      .find({ code: regex }, { code: 1 })
      .where('state')
      .in(states)
      .transform((docs) => {
        return docs.map((doc) => ({
          _id: doc._id.toString(),
          id: doc._id.toString(),
          name: doc.code,
        }));
      })
      .exec();
  }

  findAll() {
    return this.orders.find().exec();
  }

  closeOrder(_id: string) {
    return this.orders.findByIdAndUpdate(_id, {
      $set: { closed: true },
    });
  }

  reopenOrder(_id: string) {
    return this.orders.findByIdAndUpdate(_id, {
      $set: { closed: false },
    });
  }

  updateOne(_id: string, dto: UpdateOrderDto) {
    return this.orders.findByIdAndUpdate(_id, {
      $set: dto,
    });
  }
}
