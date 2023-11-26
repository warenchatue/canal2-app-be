import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { Planning } from './entities/planning.entity';

@Injectable()
export class PlanningsHandler extends BaseHandler {
  constructor() {
    super(PlanningsHandler.name);
  }

  @OnEvent('planning.created')
  handlePlanningCreated(payload: Planning) {
    this.logger.log(`Planning ${payload.date} created.`);
  }
}
