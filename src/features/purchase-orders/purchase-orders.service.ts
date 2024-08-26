import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceDeleteAbstract } from 'src/common/abstracts/service-delete.abstract';
import { USER_POPULATION } from '../users/entities/user.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import {
  PurchaseOrder,
  PurchaseOrderDocument,
} from './entities/purchase-order.entity';
import { State } from 'src/common/shared/base-schema';

@Injectable()
export class PurchaseOrdersService extends ServiceDeleteAbstract<PurchaseOrder> {
  constructor(
    @InjectModel(PurchaseOrder.name)
    private readonly orders: Model<PurchaseOrderDocument>,
  ) {
    super();
  }

  create(dto: CreatePurchaseOrderDto, announcerId: string) {
    return this.orders.create({ ...dto, announcer: announcerId });
  }

  findOne(_id) {
    const population = [
      { path: 'creator', model: 'User' },
      { path: 'manager', model: 'User' },
      { path: 'supplier', model: 'Supplier' },
      { path: 'org', model: 'Org' },
      { path: 'paymentMethod', model: 'PaymentMethod' },
      { path: 'paymentCondition', model: 'PaymentCondition' },
    ];
    return this.orders.findById(_id).orFail().populate(population).exec();
  }

  find(states: State[] = [State.active]) {
    const population = [
      { path: 'creator', model: 'User' },
      { path: 'manager', model: 'User' },
      { path: 'supplier', model: 'Supplier' },
      { path: 'org', model: 'Org' },
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

  findAll() {
    return this.orders.find().exec();
  }

  closePurchaseOrder(_id: string) {
    return this.orders.findByIdAndUpdate(_id, {
      $set: { closed: true },
    });
  }

  reopenPurchaseOrder(_id: string) {
    return this.orders.findByIdAndUpdate(_id, {
      $set: { closed: false },
    });
  }

  updateOne(_id: string, dto: UpdatePurchaseOrderDto) {
    return this.orders.findByIdAndUpdate(_id, {
      $set: dto,
    });
  }
}
