import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceDeleteAbstract } from 'src/common/abstracts/service-delete.abstract';
import { USER_POPULATION } from '../../users/entities/user.entity';
import { CreateRecoveryProcedureDto } from './dto/create-recovery-procedure.dto';
import { UpdateRecoveryProcedureDto } from './dto/update-recovery-procedure.dto';
import {
  RecoveryProcedure,
  RecoveryProcedureDocument,
} from './entities/recovery-procedure.entity';
import { State } from 'src/common/shared/base-schema';

@Injectable()
export class RecoveryProceduresService extends ServiceDeleteAbstract<RecoveryProcedure> {
  constructor(
    @InjectModel(RecoveryProcedure.name)
    private readonly invoices: Model<RecoveryProcedureDocument>,
  ) {
    super();
  }

  create(dto: CreateRecoveryProcedureDto, announcerId: string) {
    return this.invoices.create({ ...dto, announcer: announcerId });
  }

  findOne(_id) {
    const population = [
      { path: 'creator', model: 'User' },
      { path: 'manager', model: 'User' },
      { path: 'announcer', model: 'Announcer' },
      {
        path: 'order',
        model: 'Order',
        populate: [
          {
            path: 'package',
            model: 'Campaign',
          },
        ],
      },
      {
        path: 'transactions',
        model: 'Transaction',
        populate: [
          {
            path: 'paymentAccount',
            model: 'Account',
          },
        ],
      },
      { path: 'org', model: 'Org' },
      { path: 'paymentMethod', model: 'PaymentMethod' },
      { path: 'paymentCondition', model: 'PaymentCondition' },
    ];
    return this.invoices.findById(_id).orFail().populate(population).exec();
  }

  find(states: State[] = [State.active]) {
    const population = [
      { path: 'creator', model: 'User' },
      { path: 'manager', model: 'User' },
      { path: 'announcer', model: 'Announcer' },
      {
        path: 'order',
        model: 'Order',
        populate: [
          {
            path: 'package',
            model: 'Campaign',
          },
        ],
      },
      {
        path: 'transactions',
        model: 'Transaction',
        populate: [
          {
            path: 'paymentAccount',
            model: 'Account',
          },
        ],
      },
      { path: 'org', model: 'Org' },
      { path: 'paymentMethod', model: 'PaymentMethod' },
      { path: 'paymentCondition', model: 'PaymentCondition' },
    ];
    return this.invoices
      .find()
      .populate(population)
      .where('state')
      .in(states)
      .exec();
  }

  findAll() {
    return this.invoices.find().exec();
  }

  findByAnnouncer(announcerId: string, states: State[] = [State.active]) {
    const population = [{ path: 'creator', ...USER_POPULATION }];
    return this.invoices
      .find({ announcer: announcerId })
      .populate(population)
      .where('state')
      .in([states])
      .exec();
  }

  closePackage(_id: string) {
    return this.invoices.findByIdAndUpdate(_id, {
      $set: { closed: true },
    });
  }

  reopenPackage(_id: string) {
    return this.invoices.findByIdAndUpdate(_id, {
      $set: { closed: false },
    });
  }

  updateOne(_id: string, dto: UpdateRecoveryProcedureDto) {
    return this.invoices.findByIdAndUpdate(_id, {
      $set: dto,
    });
  }

  addPayment(_id: string, txnId: string) {
    return this.invoices
      .findByIdAndUpdate(_id, { $push: { transactions: txnId } })
      .orFail()
      .exec();
  }

  updatePaidAmount(_id: string, paid: number) {
    return this.invoices
      .findByIdAndUpdate(_id, {
        $set: { paid: paid },
      })
      .exec();
  }

  pullPayment(_id: string, txnId: string) {
    return this.invoices
      .findByIdAndUpdate(_id, { $pull: { transactions: txnId } })
      .orFail()
      .exec();
  }
}
