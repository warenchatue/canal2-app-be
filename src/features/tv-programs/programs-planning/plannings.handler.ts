import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { ProgramPlanning } from './entities/program-planning.entity';

@Injectable()
export class PlanningsHandler extends BaseHandler {
  constructor() {
    super(PlanningsHandler.name);
  }

  @OnEvent('planning.created')
  handlePlanningCreated(payload: ProgramPlanning) {
    this.logger.log(`ProgramPlanning ${payload.date} created.`);
  }
}
