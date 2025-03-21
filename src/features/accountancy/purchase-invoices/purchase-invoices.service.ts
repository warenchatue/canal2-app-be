import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceDeleteAbstract } from 'src/common/abstracts/service-delete.abstract';
import { USER_POPULATION } from '../../users/entities/user.entity';
import { CreatePurchaseInvoiceDto } from './dto/create-purchase-invoice.dto';
import { UpdatePurchaseInvoiceDto } from './dto/update-purchase-invoice.dto';
import {
  PurchaseInvoice,
  PurchaseInvoiceDocument,
} from './entities/purchase-invoice.entity';
import { State } from 'src/common/shared/base-schema';
import { CreateTaxItemDto } from '../invoices/dto/create-tax-item.dto';

@Injectable()
export class PurchaseInvoicesService extends ServiceDeleteAbstract<PurchaseInvoice> {
  constructor(
    @InjectModel(PurchaseInvoice.name)
    private readonly invoices: Model<PurchaseInvoiceDocument>,
  ) {
    super();
  }

  create(dto: CreatePurchaseInvoiceDto, announcerId: string) {
    return this.invoices.create({ ...dto, announcer: announcerId });
  }

  findOneNoPopulate(_id) {
    return this.invoices.findById(_id).orFail().exec();
  }

  findOne(_id) {
    const population = [
      { path: 'creator', model: 'User' },
      { path: 'manager', model: 'User' },
      { path: 'supplier', model: 'Supplier' },
      {
        path: 'order',
        model: 'Order',
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
      { path: 'supplier', model: 'Supplier' },
      {
        path: 'order',
        model: 'Order',
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

  findAllByYear(code: string) {
    const regex = new RegExp(code, 'i');
    return this.invoices.find({ code: regex }).exec();
  }

  findByAnnouncer(announcerId: string, states: State[] = [State.active]) {
    const population = [{ path: 'creator', ...USER_POPULATION }];
    return this.invoices
      .find({ announcer: announcerId })
      .populate(population)
      .where('state')
      .in(states)
      .exec();
  }

  closePackage(_id: string) {
    return this.invoices.findByIdAndUpdate(_id, {
      $set: { closed: true },
    });
  }

  updateIsDoit(
    _id: string,
    amount: number,
    amountHT: number,
    tva: number,
    tsp: number,
  ) {
    return this.invoices.findByIdAndUpdate(_id, {
      $set: {
        isDoit: false,
        amount: amount,
        amountHT: amountHT,
        tva: tva,
        tsp: tsp,
        paid: 0,
        transactions: [],
      },
    });
  }

  updatePaid(_id: string, paid: number) {
    return this.invoices.findByIdAndUpdate(_id, {
      $set: { paid: paid },
    });
  }

  reopenPackage(_id: string) {
    return this.invoices.findByIdAndUpdate(_id, {
      $set: { closed: false },
    });
  }

  updateOne(_id: string, dto: UpdatePurchaseInvoiceDto) {
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

  addTax(_id: string, tax: CreateTaxItemDto) {
    return this.invoices
      .findByIdAndUpdate(_id, { $push: { taxes: tax } })
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
