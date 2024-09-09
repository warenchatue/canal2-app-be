import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { HrAddress } from './entities/hr-address.entity';

@Injectable()
export class HrAddressHandler extends BaseHandler {
  constructor() {
    super(HrAddressHandler.name);
  }

  @OnEvent('hrAddress.created')
  handleHrAddressCreated(payload: HrAddress) {
    this.logger.log(`Address ${payload.name} created.`);
  }
}
