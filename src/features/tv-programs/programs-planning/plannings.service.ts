import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { CreateProgramPlanningDto } from './dto/create-program-planning.dto';
import { UpdatePlanningDto } from './dto/update-program-planning.dto';
import {
  ProgramPlanning,
  ProgramPlanningDocument,
} from './entities/program-planning.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Injectable()
export class ProgramPlanningsService extends DeletableMixin<ProgramPlanning> {
  constructor(
    @InjectModel(ProgramPlanning.name)
    private readonly plannings: Model<ProgramPlanningDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateProgramPlanningDto) {
    return this.plannings.create({
      ...dto,
    });
  }

  findByName(name: string) {
    return this.plannings.findOne({ name }).exec();
  }

  findOne(_id: string) {
    return this.plannings
      .findById(_id)
      .orFail()
      .populate([
        {
          path: 'hour',
          model: 'Hour',
        },
        {
          path: 'tvProgram',
          model: 'TvProgram',
        },
        {
          path: 'product',
          model: 'Product',
          populate: {
            path: 'package',
            model: 'Campaign',
            populate: [
              {
                path: 'creator',
                model: 'User',
              },
              {
                path: 'manager',
                model: 'User',
              },
              {
                path: 'announcer',
                model: 'Announcer',
              },
              {
                path: 'order',
                model: 'Order',
                populate: [
                  {
                    path: 'announcer',
                    model: 'Announcer',
                  },
                ],
              },
            ],
          },
        },
      ])
      .exec();
  }

  find(states = [State.active]) {
    return this.plannings
      .find()
      .where('state')
      .in(states)
      .populate([
        {
          path: 'hour',
          model: 'Hour',
        },
        {
          path: 'tvProgram',
          model: 'TvProgram',
        },
        {
          path: 'product',
          model: 'Product',
          populate: {
            path: 'package',
            model: 'Campaign',
            populate: [
              {
                path: 'creator',
                model: 'User',
              },
              {
                path: 'manager',
                model: 'User',
              },
              {
                path: 'announcer',
                model: 'Announcer',
              },
              {
                path: 'order',
                model: 'Order',
                populate: [
                  {
                    path: 'announcer',
                    model: 'Announcer',
                  },
                ],
              },
            ],
          },
        },
      ])
      .exec();
  }

  findAll() {
    return this.plannings.find();
  }

  async update(_id: string, dto: UpdatePlanningDto) {
    return await this.plannings
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }

  async updateDiffusedByCode(code: string) {
    return await this.plannings
      .findOneAndUpdate({ code }, { $set: { isAutoPlay: true } }, { new: true })
      .orFail()
      .exec();
  }

  async updateDiffusedById(_id: string, userId: string) {
    return await this.plannings
      .findOneAndUpdate(
        { _id },
        { $set: { isManualPlay: true, isManualPlayUpdatedBy: userId } },
        { new: true },
      )
      .orFail()
      .exec();
  }

  async updateDate(_id: string, date: string) {
    return await this.plannings
      .findOneAndUpdate({ _id }, { $set: { date: date } }, { new: true })
      .orFail()
      .exec();
  }

  async pushNotification(_id: string, notificationId: string) {
    const result = await this.plannings
      .findByIdAndUpdate(_id, {
        $push: { notifications: notificationId },
      })
      .orFail()
      .exec();

    // this.event.emit(NOTIFICATION_PUSH_EVENT, { notificationId, topic: _id });
    return result;
  }
}
