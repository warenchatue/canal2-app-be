import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Schema as sc } from 'mongoose';
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
  createOne(dto: any) {
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
          populate: [
            {
              path: 'category',
              model: 'ProgramCategory',
            },
          ],
        },
        {
          path: 'tvProgramHost',
          model: 'User',
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
          populate: [
            {
              path: 'category',
              model: 'ProgramCategory',
            },
          ],
        },
        {
          path: 'tvProgramHost',
          model: 'User',
        },
      ])
      .exec();
  }

  findAll() {
    return this.plannings.find();
  }

  async findByIds(ids: string[]): Promise<ProgramPlanning[]> {
    try {
      const documents = await this.plannings.find({ _id: { $in: ids } });
      return documents;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch documents');
    }
  }

  async update(_id: string, dto: UpdatePlanningDto) {
    return await this.plannings
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }

  async findDefaults() {
    return await this.plannings
      .find({
        $or: [
          { isDefault: true },

          { state: 'active', isDefault: { $exists: false } },
        ],
      })
      .exec();
  }

  async setDefaultForIds(ids: string[]): Promise<any> {
    // return await this.plannings
    //   .deleteMany({ _id: { $in: ids } })
    //   .orFail()
    //   .exec();
    await this.plannings
      .updateMany({ isDefault: true }, { $set: { isDefault: false } })
      .exec();

    return await this.plannings
      .updateMany({ _id: { $in: ids } }, { $set: { isDefault: true } })
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

  async updateContent(_id: string, content: string) {
    return await this.plannings
      .findOneAndUpdate({ _id }, { $set: { content: content } }, { new: true })
      .orFail()
      .exec();
  }

  async updateDate(_id: string, date: string) {
    return await this.plannings
      .findOneAndUpdate({ _id }, { $set: { date: date } }, { new: true })
      .orFail()
      .exec();
  }

  async deleteAll() {
    return await this.plannings.deleteMany().orFail().exec();
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
