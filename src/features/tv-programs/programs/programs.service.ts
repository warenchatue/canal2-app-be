import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceDeleteAbstract } from 'src/common/abstracts/service-delete.abstract';
import { USER_POPULATION } from '../../users/entities/user.entity';
import { CreateTvProgramDto } from './dto/create-program.dto';
import { UpdateTvProgramDto } from './dto/update-program.dto';
import { TvProgram, TvProgramDocument } from './entities/program.entity';
import { State } from 'src/common/shared/base-schema';

@Injectable()
export class TvProgramsService extends ServiceDeleteAbstract<TvProgram> {
  constructor(
    @InjectModel(TvProgram.name)
    private readonly tvPrograms: Model<TvProgramDocument>,
  ) {
    super();
  }

  create(dto: CreateTvProgramDto) {
    return this.tvPrograms.create({ ...dto });
  }

  findOneNP(_id) {
    return this.tvPrograms.findById(_id).orFail().exec();
  }

  findOne(_id) {
    const population = [
      { path: 'creator', model: 'User' },
      { path: 'host', model: 'User' },
      { path: 'host2', model: 'User' },
      { path: 'category', model: 'ProgramCategory' },
      { path: 'org', model: 'Org' },
    ];
    return this.tvPrograms.findById(_id).orFail().populate(population).exec();
  }

  find(states: State[] = [State.active]) {
    const population = [
      { path: 'creator', model: 'User' },
      { path: 'host', model: 'User' },
      { path: 'host2', model: 'User' },
      { path: 'category', model: 'ProgramCategory' },
      { path: 'org', model: 'Org' },
    ];
    return this.tvPrograms
      .find()
      .populate(population)
      .where('state')
      .in(states)
      .exec();
  }

  findByAnnouncer(announcerId: string, states: State[] = [State.active]) {
    const population = [{ path: 'creator', ...USER_POPULATION }];
    return this.tvPrograms
      .find({ announcer: announcerId })
      .populate(population)
      .where('state')
      .in([states])
      .exec();
  }

  closeTvProgram(_id: string) {
    return this.tvPrograms.findByIdAndUpdate(_id, {
      $set: { closed: true },
    });
  }

  reopenTvProgram(_id: string) {
    return this.tvPrograms.findByIdAndUpdate(_id, {
      $set: { closed: false },
    });
  }

  updateOne(_id: string, dto: UpdateTvProgramDto) {
    return this.tvPrograms.findByIdAndUpdate(_id, {
      $set: dto,
    });
  }

  addProduct(_id: string, productId: string) {
    return this.tvPrograms
      .findByIdAndUpdate(_id, { $push: { products: productId } })
      .orFail()
      .exec();
  }

  addPlanning(_id: string, planningId: string) {
    return this.tvPrograms
      .findByIdAndUpdate(_id, { $push: { plannings: planningId } })
      .orFail()
      .exec();
  }

  pullProduct(_id: string, productId: string) {
    return this.tvPrograms
      .findByIdAndUpdate(_id, { $pull: { products: productId } })
      .orFail()
      .exec();
  }

  pullPlanning(_id: string, planningId: string) {
    return this.tvPrograms
      .findByIdAndUpdate(_id, { $pull: { plannings: planningId } })
      .orFail()
      .exec();
  }
}
