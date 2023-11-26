import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from '../../notifications/notifications.module';
import { UsersModule } from '../../users/users.module';
import { Order, OrderSchema } from './entities/order.entity';
import { PackageController } from './orders.controller';
import { PackageHandler } from './orders.handler';
import { OrdersService } from './orders.service';
import { PlanningsModule } from '../../plannings/plannings.module';
import { SpotsModule } from '../../products/products.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    forwardRef(() => PlanningsModule),
    forwardRef(() => SpotsModule),
    NotificationsModule,
    UsersModule,
  ],
  controllers: [PackageController],
  providers: [OrdersService, PackageHandler],
  exports: [OrdersService],
})
export class PackagesModule {}
