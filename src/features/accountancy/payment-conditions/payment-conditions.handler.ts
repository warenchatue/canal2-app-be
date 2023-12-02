import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { PaymentCondition } from './entities/payment-condition.entity';

@Injectable()
export class PaymentConditionsHandler extends BaseHandler {
  constructor() {
    super(PaymentConditionsHandler.name);
  }

  @OnEvent('paymentCondition.created')
  handlePaymentConditionCreated(payload: PaymentCondition) {
    this.logger.log(`PaymentCondition ${payload.label} created.`);
  }
}
