import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from 'src/features/orders/orders.module';
import { NotificationsModule } from '../../notifications/notifications.module';
import { UsersModule } from '../../users/users.module';
import {
  AccountingDoc,
  AccountingDocSchema,
} from './entities/accounting-doc.entity';
import { AccountingDocsController } from './accounting-docs.controller';
import { AccountingDocsHandler } from './accounting-docs.handler';
import { AccountingDocsService } from './accounting-docs.service';
import { TransactionsModule } from 'src/features/transactions/transactions.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountingDoc.name, schema: AccountingDocSchema },
    ]),
    OrdersModule,
    NotificationsModule,
    UsersModule,
    TransactionsModule,
  ],
  controllers: [AccountingDocsController],
  providers: [AccountingDocsService, AccountingDocsHandler],
  exports: [AccountingDocsService],
})
export class AccountingDocsModule {}
