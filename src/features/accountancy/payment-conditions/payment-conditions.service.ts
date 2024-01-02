import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { CreatePaymentConditionDto } from './dto/create-payment-condition.dto';
import { UpdatePaymentConditionDto } from './dto/update-payment-condition.dto';
import {
  PaymentCondition,
  PaymentConditionDocument,
} from './entities/payment-condition.entity';

@Injectable()
export class PaymentConditionsService extends DeletableMixin<PaymentCondition> {
  constructor(
    @InjectModel(PaymentCondition.name)
    private readonly paymentConditions: Model<PaymentConditionDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreatePaymentConditionDto) {
    return this.paymentConditions.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.paymentConditions.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return (
      this.paymentConditions
        .find()
        .where('state')
        .in(states)
        // .populate([
        //   {
        //     path: 'category',
        //     model: 'Category',
        //   },
        // ])
        .exec()
    );
  }

  findAll() {
    return this.paymentConditions.find().exec();
  }

  async update(_id: string, dto: UpdatePaymentConditionDto) {
    return await this.paymentConditions
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
