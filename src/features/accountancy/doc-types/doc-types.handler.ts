import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { DocType } from './entities/doc-type.entity';

@Injectable()
export class DocTypesHandler extends BaseHandler {
  constructor() {
    super(DocTypesHandler.name);
  }

  @OnEvent('article.created')
  handleTaxCreated(payload: DocType) {
    this.logger.log(`Tax ${payload.label} created.`);
  }
}
