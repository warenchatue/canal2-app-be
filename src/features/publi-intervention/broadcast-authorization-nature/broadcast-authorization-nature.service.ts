import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBroadcastAuthorizationNatureDto } from './dto/create-broadcast-authorization-nature.dto';
import { UpdateBroadcastAuthorizationNatureDto } from './dto/update-broadcast-authorization-nature.dto';
import {
  BroadcastAuthorizationNature,
  BroadcastAuthorizationNatureDocument,
} from './entities/broadcast-authorization-nature.entity';
import { ServiceDeleteAbstract } from 'src/common/abstracts/service-delete.abstract';
import { State } from 'src/common/shared/base-schema';
import { TvProgram } from '../../tv-programs/programs/entities/program.entity'; // Correct import path

@Injectable()
export class BroadcastAuthorizationNatureService extends ServiceDeleteAbstract<BroadcastAuthorizationNature> {
  constructor(
    @InjectModel(BroadcastAuthorizationNature.name)
    private readonly broadcastAuthorizationNature: Model<BroadcastAuthorizationNature>,
  ) {
    super();
  }

  create(dto: CreateBroadcastAuthorizationNatureDto) {
    return this.broadcastAuthorizationNature.create({
      ...dto,
    });
  }

  findActive(states = [State.active]) {
    const population = [{ path: 'program_id', model: 'TvProgram' }]; // Use 'TvProgram' as the model name

    return this.broadcastAuthorizationNature
      .find()
      .populate(population)
      .where('state')
      .in(states)
      .exec();
  }

  findAll() {
    return this.broadcastAuthorizationNature
      .find({ deleted: false })
      .populate({ path: 'program_id', model: 'TvProgram' })
      .lean()
      .exec();
  }

  findOne(id: string) {
    return this.broadcastAuthorizationNature
      .findOne({ _id: id, deleted: false })
      .populate({ path: 'program_id', model: 'TvProgram' }) // Use 'TvProgram' as the model name
      .orFail()
      .exec();
  }

  update(
    id: string,
    updateBroadcastAuthorizationNatureDto: UpdateBroadcastAuthorizationNatureDto,
  ) {
    return this.broadcastAuthorizationNature
      .findByIdAndUpdate(id, updateBroadcastAuthorizationNatureDto, {
        new: true,
      })
      .exec();
  }
}
