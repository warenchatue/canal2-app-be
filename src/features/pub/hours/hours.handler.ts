import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { Hour } from './entities/hour.entity';

@Injectable()
export class HoursHandler extends BaseHandler {
  constructor() {
    super(HoursHandler.name);
  }

  @OnEvent('Hour.created')
  handleHourCreated(payload: Hour) {
    this.logger.log(`Hour ${payload.name} created.`);
  }
}
