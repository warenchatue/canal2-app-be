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
      {
        path: 'products',
        model: 'Product',
      },
      {
        path: 'plannings',
        model: 'Planning',
        populate: [
          {
            path: 'hour',
            model: 'Hour',
          },
          {
            path: 'product',
            model: 'Product',
          },
        ],
      },
    ];
    return this.orders.findById(_id).orFail().populate(population).exec();
  }

  find(states: State[] = [State.active]) {
    const population = [
      { path: 'creator', model: 'User' },
      { path: 'manager', model: 'User' },
      { path: 'announcer', model: 'Announcer' },
      {
        path: 'products',
        model: 'Product',
      },
      {
        path: 'plannings',
        model: 'Planning',
      },
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

  closePackage(_id: string) {
    return this.orders.findByIdAndUpdate(_id, {
      $set: { closed: true },
    });
  }

  reopenPackage(_id: string) {
    return this.orders.findByIdAndUpdate(_id, {
      $set: { closed: false },
    });
  }

  updateOne(_id: string, dto: UpdateOrderDto) {
    return this.orders.findByIdAndUpdate(_id, {
      $set: dto,
    });
  }

  addProduct(_id: string, productId: string) {
    return this.orders
      .findByIdAndUpdate(_id, { $push: { products: productId } })
      .orFail()
      .exec();
  }

  addPlanning(_id: string, planningId: string) {
    return this.orders
      .findByIdAndUpdate(_id, { $push: { plannings: planningId } })
      .orFail()
      .exec();
  }

  pullProduct(_id: string, productId: string) {
    return this.orders
      .findByIdAndUpdate(_id, { $pull: { products: productId } })
      .orFail()
      .exec();
  }

  pullPlanning(_id: string, planningId: string) {
    return this.orders
      .findByIdAndUpdate(_id, { $pull: { plannings: planningId } })
      .orFail()
      .exec();
  }
}
