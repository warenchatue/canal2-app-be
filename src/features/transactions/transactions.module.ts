import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from '../notifications/notifications.module';
import { OrgsModule } from '../orgs/orgs.module';
import { UsersModule } from '../users/users.module';
import { Transaction, TransactionSchema } from './entities/transaction.entity';
import {
  OrgTransactionsController,
  TransactionsController,
} from './transactions.controller';
import { TransactionsHandler } from './transactions.handler';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    OrgsModule,
    NotificationsModule,
    UsersModule,
  ],
  controllers: [TransactionsController, OrgTransactionsController],
  providers: [TransactionsService, TransactionsHandler],
  exports: [TransactionsService],
})
export class TransactionsModule {}
