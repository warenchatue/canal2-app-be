import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsHandler extends BaseHandler {
  constructor() {
    super(AccountsHandler.name);
  }

  @OnEvent('article.created')
  handleTaxCreated(payload: Account) {
    this.logger.log(`Tax ${payload.name} created.`);
  }
}
