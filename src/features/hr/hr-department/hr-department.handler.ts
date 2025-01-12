import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { HrDepartment } from './entities/hr-department.entity';

@Injectable()
export class HrDepartmentHandler extends BaseHandler {
  constructor() {
    super(HrDepartmentHandler.name);
  }

  @OnEvent('hrDepartment.created')
  handleHrDepartmentCreated(payload: HrDepartment) {
    this.logger.log(`Department ${payload.name} created.`);
  }
}
