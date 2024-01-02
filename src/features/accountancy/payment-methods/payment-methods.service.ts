import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { CreatePaymentMethodDto } from './dto/create-payment-methods.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-methods.dto';
import {
  PaymentMethod,
  PaymentMethodDocument,
} from './entities/payment-method.entity';

@Injectable()
export class PaymentMethodsService extends DeletableMixin<PaymentMethod> {
  constructor(
    @InjectModel(PaymentMethod.name)
    private readonly accounts: Model<PaymentMethodDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreatePaymentMethodDto) {
    return this.accounts.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.accounts.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return (
      this.accounts
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
    return this.accounts.find().exec();
  }

  async update(_id: string, dto: UpdatePaymentMethodDto) {
    return await this.accounts
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
