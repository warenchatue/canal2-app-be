import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { CreateHrJobDto } from './dto/create-hr-job.dto';
import { UpdateHrJobDto } from './dto/update-hr-job.dto';
import { HrJob, HrJobDocument } from './entities/hr-job.entity';

@Injectable()
export class HrJobService extends DeletableMixin<HrJob> {
  constructor(
    @InjectModel(HrJob.name)
    private readonly hrJob: Model<HrJobDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateHrJobDto) {
    return this.hrJob.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.hrJob.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return this.hrJob
      .find()
      .where('state')
      .in(states)
      .populate([
        {
          path: 'position',
          model: 'HrPosition',
        },
        {
          path: 'department',
          model: 'HrDepartment',
        },
      ])
      .exec();
  }

  findAll() {
    return this.hrJob
      .find()
      .populate([
        {
          path: 'position',
          model: 'HrPosition',
        },
        {
          path: 'department',
          model: 'HrDepartment',
        },
      ])
      .exec();
  }

  async update(_id: string, dto: UpdateHrJobDto) {
    return await this.hrJob
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
