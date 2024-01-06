import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { PaymentMethod } from './entities/payment-method.entity';

@Injectable()
export class PaymentMethodsHandler extends BaseHandler {
  constructor() {
    super(PaymentMethodsHandler.name);
  }

  @OnEvent('paymentMethod.created')
  handlePaymentMethodCreated(payload: PaymentMethod) {
    this.logger.log(`Payment Method ${payload.label} created.`);
  }
}
