import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleDocument } from './entities/article.entity';

@Injectable()
export class ArticlesService extends DeletableMixin<Article> {
  constructor(
    @InjectModel(Article.name)
    private readonly articles: Model<ArticleDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateArticleDto) {
    return this.articles.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.articles.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return this.articles
      .find()
      .where('state')
      .in(states)
      .populate([
        {
          path: 'category',
          model: 'ArticleCategory',
        },
      ])
      .exec();
  }

  findAll() {
    return this.articles
      .find()
      .populate([
        {
          path: 'category',
          model: 'ArticleCategory',
        },
      ])
      .exec();
  }

  async update(_id: string, dto: UpdateArticleDto) {
    return await this.articles
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
