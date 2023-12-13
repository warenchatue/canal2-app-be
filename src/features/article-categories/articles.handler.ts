import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesHandler extends BaseHandler {
  constructor() {
    super(ArticlesHandler.name);
  }

  @OnEvent('article.created')
  handleArticleCreated(payload: Article) {
    this.logger.log(`Article ${payload.name} created.`);
  }
}
