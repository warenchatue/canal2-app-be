import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { Tax, TaxDocument } from './entities/tax.entity';

@Injectable()
export class TaxesService extends DeletableMixin<Tax> {
  constructor(
    @InjectModel(Tax.name)
    private readonly taxes: Model<TaxDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateTaxDto) {
    return this.taxes.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.taxes.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return (
      this.taxes
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
    return this.taxes.find().exec();
  }

  async update(_id: string, dto: UpdateTaxDto) {
    return await this.taxes
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
