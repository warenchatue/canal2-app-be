import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { ArticleCategory } from './entities/article-category.entity';

@Injectable()
export class ArticleCategoriesHandler extends BaseHandler {
  constructor() {
    super(ArticleCategoriesHandler.name);
  }

  @OnEvent('articleCategory.created')
  handleArticleCategoryCreated(payload: ArticleCategory) {
    this.logger.log(`ArticleCategory ${payload.name} created.`);
  }
}
