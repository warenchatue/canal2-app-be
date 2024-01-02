import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceDeleteAbstract } from 'src/common/abstracts/service-delete.abstract';
import { USER_POPULATION } from '../../users/entities/user.entity';
import { CreateAccountingDocDto } from './dto/create-accounting-docs.dto';
import { UpdateAccountingDocDto } from './dto/update-accounting-doc.dto';
import {
  AccountingDoc,
  AccountingDocDocument,
} from './entities/accounting-doc.entity';
import { State } from 'src/common/shared/base-schema';

@Injectable()
export class AccountingDocsService extends ServiceDeleteAbstract<AccountingDoc> {
  constructor(
    @InjectModel(AccountingDoc.name)
    private readonly accountingDocs: Model<AccountingDocDocument>,
  ) {
    super();
  }

  create(dto: CreateAccountingDocDto) {
    return this.accountingDocs.create({ ...dto });
  }

  findOne(_id) {
    const population = [
      { path: 'creator', model: 'User' },
      { path: 'beneficiary', model: 'User' },
      { path: 'authorizer', model: 'User' },
      { path: 'validator', model: 'User' },
      { path: 'org', model: 'Org' },
      { path: 'paymentAccount', model: 'Account' },
    ];
    return this.accountingDocs
      .findById(_id)
      .orFail()
      .populate(population)
      .exec();
  }

  find(states: State[] = [State.active]) {
    const population = [
      { path: 'creator', model: 'User' },
      { path: 'beneficiary', model: 'User' },
      { path: 'authorizer', model: 'User' },
      { path: 'validator', model: 'User' },
      { path: 'org', model: 'Org' },
      { path: 'paymentAccount', model: 'Account' },
    ];
    return this.accountingDocs
      .find()
      .populate(population)
      .where('state')
      .in(states)
      .exec();
  }

  findAll() {
    return this.accountingDocs.find().exec();
  }

  findByAnnouncer(announcerId: string, states: State[] = [State.active]) {
    const population = [{ path: 'creator', ...USER_POPULATION }];
    return this.accountingDocs
      .find({ announcer: announcerId })
      .populate(population)
      .where('state')
      .in([states])
      .exec();
  }

  closePackage(_id: string) {
    return this.accountingDocs.findByIdAndUpdate(_id, {
      $set: { closed: true },
    });
  }

  reopenPackage(_id: string) {
    return this.accountingDocs.findByIdAndUpdate(_id, {
      $set: { closed: false },
    });
  }

  updateOne(_id: string, dto: UpdateAccountingDocDto) {
    return this.accountingDocs.findByIdAndUpdate(_id, {
      $set: dto,
    });
  }

  addPayment(_id: string, txnId: string) {
    return this.accountingDocs
      .findByIdAndUpdate(_id, { $push: { transactions: txnId } })
      .orFail()
      .exec();
  }

  updatePaidAmount(_id: string, paid: number) {
    return this.accountingDocs
      .findByIdAndUpdate(_id, {
        $set: { paid: paid },
      })
      .exec();
  }

  pullPayment(_id: string, txnId: string) {
    return this.accountingDocs
      .findByIdAndUpdate(_id, { $pull: { transactions: txnId } })
      .orFail()
      .exec();
  }
}
