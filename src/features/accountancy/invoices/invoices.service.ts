import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceDeleteAbstract } from 'src/common/abstracts/service-delete.abstract';
import { USER_POPULATION } from '../../users/entities/user.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice, InvoiceDocument } from './entities/invoice.entity';
import { State } from 'src/common/shared/base-schema';

@Injectable()
export class InvoicesService extends ServiceDeleteAbstract<Invoice> {
  constructor(
    @InjectModel(Invoice.name)
    private readonly invoices: Model<InvoiceDocument>,
  ) {
    super();
  }

  create(dto: CreateInvoiceDto, announcerId: string) {
    return this.invoices.create({ ...dto, announcer: announcerId });
  }

  findOne(_id) {
    const population = [
      { path: 'creator', model: 'User' },
      { path: 'manager', model: 'User' },
      { path: 'announcer', model: 'Announcer' },
      { path: 'org', model: 'Org' },
    ];
    return this.invoices.findById(_id).orFail().populate(population).exec();
  }

  find(states: State[] = [State.active]) {
    const population = [
      { path: 'creator', model: 'User' },
      { path: 'manager', model: 'User' },
      { path: 'announcer', model: 'Announcer' },
      { path: 'org', model: 'Org' },
    ];
    return this.invoices
      .find()
      .populate(population)
      .where('state')
      .in(states)
      .exec();
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

  updateOne(_id: string, dto: UpdateInvoiceDto) {
    return this.invoices.findByIdAndUpdate(_id, {
      $set: dto,
    });
  }

  addProduct(_id: string, productId: string) {
    return this.invoices
      .findByIdAndUpdate(_id, { $push: { products: productId } })
      .orFail()
      .exec();
  }

  addPlanning(_id: string, planningId: string) {
    return this.invoices
      .findByIdAndUpdate(_id, { $push: { plannings: planningId } })
      .orFail()
      .exec();
  }

  pullProduct(_id: string, productId: string) {
    return this.invoices
      .findByIdAndUpdate(_id, { $pull: { products: productId } })
      .orFail()
      .exec();
  }

  pullPlanning(_id: string, planningId: string) {
    return this.invoices
      .findByIdAndUpdate(_id, { $pull: { plannings: planningId } })
      .orFail()
      .exec();
  }
}
