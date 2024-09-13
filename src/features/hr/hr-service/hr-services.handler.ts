import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { HrService } from './entities/hr-service.entity';

@Injectable()
export class HrServicesHandler extends BaseHandler {
  constructor() {
    super(HrServicesHandler.name);
  }

  @OnEvent('hrService.created')
  handleHrServiceCreated(payload: HrService) {
    this.logger.log(`Service ${payload.name} created.`);
  }
}
