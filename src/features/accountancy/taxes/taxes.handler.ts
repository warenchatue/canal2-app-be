import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { Tax } from './entities/tax.entity';

@Injectable()
export class TaxesHandler extends BaseHandler {
  constructor() {
    super(TaxesHandler.name);
  }

  @OnEvent('tax.created')
  handleTaxCreated(payload: Tax) {
    this.logger.log(`Tax ${payload.name} created.`);
  }
}
