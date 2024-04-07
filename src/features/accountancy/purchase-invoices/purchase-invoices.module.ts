import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from 'src/features/orders/orders.module';
import { NotificationsModule } from '../../notifications/notifications.module';
import { UsersModule } from '../../users/users.module';
import {
  PurchaseInvoice,
  PurchaseInvoiceSchema,
} from './entities/purchase-invoice.entity';
import { PurchaseInvoicesController } from './purchase-invoices.controller';
import { PurchaseInvoicesHandler } from './purchase-invoices.handler';
import { PurchaseInvoicesService } from './purchase-invoices.service';
import { TransactionsModule } from 'src/features/transactions/transactions.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PurchaseInvoice.name, schema: PurchaseInvoiceSchema },
    ]),
    forwardRef(() => TransactionsModule),
    OrdersModule,
    NotificationsModule,
    UsersModule,
  ],
  controllers: [PurchaseInvoicesController],
  providers: [PurchaseInvoicesService, PurchaseInvoicesHandler],
  exports: [PurchaseInvoicesService],
})
export class PurchaseInvoicesModule {}
