import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceDeleteAbstract } from 'src/common/abstracts/service-delete.abstract';
import { USER_POPULATION } from '../../users/entities/user.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice, InvoiceDocument } from './entities/invoice.entity';
import { State } from 'src/common/shared/base-schema';
import { CreateTaxItemDto } from './dto/create-tax-item.dto';
import { FindQueryDto } from 'src/common/dto/find-query.dto';
import { paginate } from 'nestjs-paginate-mongo';
import {
  Announcer,
  AnnouncerDocument,
} from 'src/features/announcers/entities/announcer.entity';

@Injectable()
export class InvoicesService extends ServiceDeleteAbstract<Invoice> {
  constructor(
    @InjectModel(Invoice.name)
    private readonly invoices: Model<InvoiceDocument>,
    @InjectModel(Announcer.name)
    private readonly announcer: Model<AnnouncerDocument>,
  ) {
    super();
  }

  create(dto: CreateInvoiceDto, announcerId: string) {
    return this.invoices.create({ ...dto, announcer: announcerId });
  }

  findOneNoPopulate(_id) {
    return this.invoices.findById(_id).orFail().exec();
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

  async findPaginate(
    query: FindQueryDto<InvoiceDocument>,
    states: State[] = [State.active],
  ) {
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
    let announcerIds: string[] = [];
    const { search, page, perPage } = query;
    if (search) {
      const announcers = await this.announcer
        .find({
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { code: { $regex: search, $options: 'i' } },
          ],
        })
        .select('_id')
        .exec();

      announcerIds = announcers.map((announcer) => announcer._id);
    }

    const invoiceFilter = {
      ...{ state: { $in: states } },
      ...(search
        ? {
            $or: [
              { code: { $regex: search, $options: 'i' } },
              { announcer: { $in: announcerIds } },
            ],
          }
        : {}),
    };

    return paginate(
      this.invoices
        .find(invoiceFilter)
        .sort({ ['date']: -1 })
        .populate(population),
      {
        page,
        perPage,
      },
    );
  }

  findAll() {
    return this.invoices.find().exec();
  }

  findLightByCode(states = [State.active], code: string) {
    const regex = new RegExp(code, 'i');
    return this.invoices
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

  updateOne(_id: string, dto: UpdateInvoiceDto) {
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

  countTotal() {
    return this.invoices
      .countDocuments({
        state: { $in: [State.active] },
      })
      .exec();
  }

  countUnPaid() {
    return this.invoices
      .countDocuments({
        state: { $in: [State.active] },
        $expr: { $lt: ['$paid', '$amount'] },
      })
      .exec();
  }
}
