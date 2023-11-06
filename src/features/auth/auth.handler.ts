import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { User } from '../users/entities/user.entity';

export const AUTH_LOGIN_EVENT = 'auth.login';

@Injectable()
export class AuthHandler extends BaseHandler {
  constructor() {
    super(AuthHandler.name);
  }

  @OnEvent(AUTH_LOGIN_EVENT)
  handleLogin(user: User) {
    this.logger.log(`New login :> ${JSON.stringify(user)}`);
  }
}
