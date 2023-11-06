import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { User } from './entities/user.entity';

@Injectable()
export class UsersHandler extends BaseHandler {
  constructor() {
    super(UsersHandler.name);
  }

  @OnEvent('user.created')
  handleUserCreated(payload: User) {
    this.logger.log(`User ${payload.phone} created.`);
  }
}
