import { Module } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import {
  PaymentMethod,
  PaymentMethodSchema,
} from './entities/payment-method.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentMethodsHandler } from './payment-methods.handler';
// import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentMethod.name, schema: PaymentMethodSchema },
    ]),
  ],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService, PaymentMethodsHandler],
  exports: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
