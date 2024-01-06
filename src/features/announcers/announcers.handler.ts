import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { Announcer } from './entities/announcer.entity';

@Injectable()
export class AnnouncersHandler extends BaseHandler {
  constructor() {
    super(AnnouncersHandler.name);
  }

  @OnEvent('announcer.created')
  handleAnnouncerCreated(payload: Announcer) {
    this.logger.log(`Announcer ${payload.phone} created.`);
  }
}
