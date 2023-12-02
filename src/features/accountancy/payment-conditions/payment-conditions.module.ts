import { Module } from '@nestjs/common';
import { PaymentConditionsService } from './payment-conditions.service';
import { PaymentConditionsController } from './payment-conditions.controller';
import {
  PaymentCondition,
  PaymentConditionSchema,
} from './entities/payment-condition.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentConditionsHandler } from './payment-conditions.handler';
// import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentCondition.name, schema: PaymentConditionSchema },
    ]),
  ],
  controllers: [PaymentConditionsController],
  providers: [PaymentConditionsService, PaymentConditionsHandler],
  exports: [PaymentConditionsService],
})
export class PaymentConditionsModule {}
