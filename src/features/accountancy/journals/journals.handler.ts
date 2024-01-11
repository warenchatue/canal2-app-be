import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { Journal } from './entities/journal.entity';

@Injectable()
export class JournalsHandler extends BaseHandler {
  constructor() {
    super(JournalsHandler.name);
  }

  @OnEvent('article.created')
  handleTaxCreated(payload: Journal) {
    this.logger.log(`Tax ${payload.label} created.`);
  }
}
