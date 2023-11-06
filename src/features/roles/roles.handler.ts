import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesHandler extends BaseHandler {
  constructor() {
    super(RolesHandler.name);
  }

  @OnEvent('role.created')
  handleRoleCreated(payload: Role) {
    this.logger.log(`Role ${payload.name} created.`);
  }
}
