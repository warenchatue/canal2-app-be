import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';

@Injectable()
export class DatabaseHandler extends BaseHandler {
  constructor() {
    super(DatabaseHandler.name);
  }

  @OnEvent('database.export')
  handleAnnouncerCreated(payload: any) {
    this.logger.log(`Database ${payload.db_name} exported.`);
  }
}
