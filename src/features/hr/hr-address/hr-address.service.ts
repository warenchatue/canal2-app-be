import { Injectable } from '@nestjs/common';
import { CreateHrAddressDto } from './dto/create-hr-address.dto';
import { UpdateHrAddressDto } from './dto/update-hr-address.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HrAddress, HrAddressDocument } from './entities/hr-address.entity';

@Injectable()
export class HrAddressService extends DeletableMixin<HrAddress> {
  constructor(
    @InjectModel(HrAddress.name)
    private readonly hrAddress: Model<HrAddressDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateHrAddressDto) {
    return this.hrAddress.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.hrAddress.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return (
      this.hrAddress
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
    return this.hrAddress.find().exec();
  }

  async update(_id: string, dto: UpdateHrAddressDto) {
    return await this.hrAddress
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
