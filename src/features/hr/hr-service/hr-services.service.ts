import { Injectable } from '@nestjs/common';
import { CreateHrServiceDto } from './dto/create-hr-service.dto';
import { UpdateHrServiceDto } from './dto/update-hr-service.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HrService, HrServiceDocument } from './entities/hr-service.entity';

@Injectable()
export class HrServiceService extends DeletableMixin<HrService> {
  constructor(
    @InjectModel(HrService.name)
    private readonly hrServices: Model<HrServiceDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateHrServiceDto) {
    return this.hrServices.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.hrServices.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return (
      this.hrServices
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
    return this.hrServices.find().exec();
  }

  async update(_id: string, dto: UpdateHrServiceDto) {
    return await this.hrServices
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
