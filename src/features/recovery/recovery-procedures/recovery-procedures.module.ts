import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from 'src/features/orders/orders.module';
import { NotificationsModule } from '../../notifications/notifications.module';
import { UsersModule } from '../../users/users.module';
import {
  RecoveryProcedure,
  RecoveryProcedureSchema,
} from './entities/recovery-procedure.entity';
import { RecoveryProceduresController } from './recovery-procedures.controller';
import { RecoveryProceduresHandler } from './recovery-procedures.handler';
import { RecoveryProceduresService } from './recovery-procedures.service';
import { TransactionsModule } from 'src/features/transactions/transactions.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RecoveryProcedure.name, schema: RecoveryProcedureSchema },
    ]),
    OrdersModule,
    NotificationsModule,
    UsersModule,
    TransactionsModule,
  ],
  controllers: [RecoveryProceduresController],
  providers: [RecoveryProceduresService, RecoveryProceduresHandler],
  exports: [RecoveryProceduresService],
})
export class RecoveryProceduresModule {}
