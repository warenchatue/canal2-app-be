import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import {
  PurchaseOrder,
  PurchaseOrderSchema,
} from './entities/purchase-order.entity';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { PurchaseOrderHandler } from './purchase-orders.handler';
import { PurchaseOrdersService } from './purchase-orders.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PurchaseOrder.name, schema: PurchaseOrderSchema },
    ]),
    NotificationsModule,
    UsersModule,
  ],
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService, PurchaseOrderHandler],
  exports: [PurchaseOrdersService],
})
export class PurchaseOrdersModule {}
