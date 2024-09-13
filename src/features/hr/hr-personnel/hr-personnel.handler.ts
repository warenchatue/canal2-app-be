import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { HrPersonnel } from './entities/hr-personnel.entity';

@Injectable()
export class HrPersonnelHandler extends BaseHandler {
  constructor() {
    super(HrPersonnelHandler.name);
  }

  @OnEvent('hrPersonnel.created')
  handleArticleCreated(payload: HrPersonnel) {
    this.logger.log(`Hrpersonnel ${payload.firstName} created.`);
  }
}
