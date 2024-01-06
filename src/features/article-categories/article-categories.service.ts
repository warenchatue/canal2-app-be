import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { CreateArticleCategoryDto } from './dto/create-article-category.dto';
import { UpdateArticleCategoryDto } from './dto/update-article-catogory.dto';
import {
  ArticleCategory,
  ArticleCategoryDocument,
} from './entities/article-category.entity';

@Injectable()
export class ArticleCategoriesService extends DeletableMixin<ArticleCategory> {
  constructor(
    @InjectModel(ArticleCategory.name)
    private readonly articles: Model<ArticleCategoryDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateArticleCategoryDto) {
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

  async update(_id: string, dto: UpdateArticleCategoryDto) {
    return await this.articles
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
