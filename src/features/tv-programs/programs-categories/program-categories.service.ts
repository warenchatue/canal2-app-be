import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { CreateProgramCategoryDto } from './dto/create-program-category.dto';
import { UpdateProgramCategoryDto } from './dto/update-program-category.dto';
import {
  ProgramCategory,
  ProgramCategoryDocument,
} from './entities/program-category.entity';

@Injectable()
export class ProgramCategoriesService extends DeletableMixin<ProgramCategory> {
  constructor(
    @InjectModel(ProgramCategory.name)
    private readonly articles: Model<ProgramCategoryDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateProgramCategoryDto) {
    return this.articles.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.articles.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return this.articles.find().where('state').in(states).exec();
  }

  findAll() {
    return this.articles.find().exec();
  }

  async update(_id: string, dto: UpdateProgramCategoryDto) {
    return await this.articles
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
