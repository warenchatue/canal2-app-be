import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { Order, OrderSchema } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrderHandler } from './orders.handler';
import { OrdersService } from './orders.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    NotificationsModule,
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderHandler],
  exports: [OrdersService],
})
export class OrdersModule {}
