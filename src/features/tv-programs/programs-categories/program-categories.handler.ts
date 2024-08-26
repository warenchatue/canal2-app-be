import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { ProgramCategory } from './entities/program-category.entity';

@Injectable()
export class ProgramCategoriesHandler extends BaseHandler {
  constructor() {
    super(ProgramCategoriesHandler.name);
  }

  @OnEvent('pogramCategory.created')
  handleProgramCategoryCreated(payload: ProgramCategory) {
    this.logger.log(`ProgramCategory ${payload.name} created.`);
  }
}
