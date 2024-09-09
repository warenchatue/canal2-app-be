import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { CreateHrPersonnelDto } from './dto/create-hr-personnel.dto';
import { UpdateHrPersonnelDto } from './dto/update-hr-personnel.dto';
import {
  HrPersonnel,
  HrPersonnelDocument,
} from './entities/hr-personnel.entity';

@Injectable()
export class HrPersonnelService extends DeletableMixin<HrPersonnel> {
  constructor(
    @InjectModel(HrPersonnel.name)
    private readonly hrPersonnel: Model<HrPersonnelDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateHrPersonnelDto) {
    return this.hrPersonnel.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.hrPersonnel.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return this.hrPersonnel
      .find()
      .where('state')
      .in(states)
      .populate([
        {
          path: 'manager',
          model: 'HrPersonnel',
        },
        {
          path: 'position',
          model: 'HrPosition',
        },
        {
          path: 'address',
          model: 'HrAddress',
        },
      ])
      .exec();
  }

  findAll() {
    return this.hrPersonnel
      .find()
      .populate([
        {
          path: 'manager',
          model: 'HrPersonnel',
        },
        {
          path: 'position',
          model: 'HrPosition',
        },
        {
          path: 'address',
          model: 'HrAddress',
        },
      ])
      .exec();
  }

  async update(_id: string, dto: UpdateHrPersonnelDto) {
    return await this.hrPersonnel
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
