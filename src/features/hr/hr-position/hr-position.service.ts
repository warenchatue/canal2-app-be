import { Injectable } from '@nestjs/common';
import { CreateHrPositionDto } from './dto/create-hr-position.dto';
import { UpdateHrPositionDto } from './dto/update-hr-position.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HrPosition, HrPositionDocument } from './entities/hr-position.entity';

@Injectable()
export class HrPositionService extends DeletableMixin<HrPosition> {
  constructor(
    @InjectModel(HrPosition.name)
    private readonly hrPositions: Model<HrPositionDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateHrPositionDto) {
    return this.hrPositions.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.hrPositions.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return (
      this.hrPositions
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
    return this.hrPositions.find().exec();
  }

  async update(_id: string, dto: UpdateHrPositionDto) {
    return await this.hrPositions
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
