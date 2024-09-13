import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { CreateHrDepartmentDto } from './dto/create-hr-department.dto';
import { UpdateHrDepartmentDto } from './dto/update-hr-department.dto';
import {
  HrDepartment,
  HrDepartmentDocument,
} from './entities/hr-department.entity';

@Injectable()
export class HrDepartmentService extends DeletableMixin<HrDepartment> {
  constructor(
    @InjectModel(HrDepartment.name)
    private readonly hrDepartment: Model<HrDepartmentDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateHrDepartmentDto) {
    return this.hrDepartment.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.hrDepartment.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return this.hrDepartment.find().where('state').in(states).exec();
  }

  findAll() {
    return this.hrDepartment.find().exec();
  }

  async update(_id: string, dto: UpdateHrDepartmentDto) {
    return await this.hrDepartment
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
