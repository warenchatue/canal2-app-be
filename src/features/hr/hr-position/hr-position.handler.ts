import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { HrPosition } from './entities/hr-position.entity';

@Injectable()
export class HrPositionHandler extends BaseHandler {
  constructor() {
    super(HrPositionHandler.name);
  }

  @OnEvent('hrPosition.created')
  handleHrPositionCreated(payload: HrPosition) {
    this.logger.log(`Position ${payload.name} created.`);
  }
}
