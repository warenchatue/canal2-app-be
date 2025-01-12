import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from 'src/features/orders/orders.module';
import { NotificationsModule } from '../../notifications/notifications.module';
import { UsersModule } from '../../users/users.module';
import { Invoice, InvoiceSchema } from './entities/invoice.entity';
import { InvoicesController } from './invoices.controller';
import { InvoicesHandler } from './invoices.handler';
import { InvoicesService } from './invoices.service';
import { TransactionsModule } from 'src/features/transactions/transactions.module';
import {
  Announcer,
  AnnouncerSchema,
} from 'src/features/announcers/entities/announcer.entity';
import { AnnouncersModule } from 'src/features/announcers/announcers.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    MongooseModule.forFeature([
      { name: Announcer.name, schema: AnnouncerSchema },
    ]),
    forwardRef(() => TransactionsModule),
    OrdersModule,
    NotificationsModule,
    UsersModule,
    AnnouncersModule,
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoicesHandler],
  exports: [InvoicesService],
})
export class InvoicesModule {}
