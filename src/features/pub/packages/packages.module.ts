import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from '../../notifications/notifications.module';
import { UsersModule } from '../../users/users.module';
import { OrderPackage, PackageSchema } from './entities/package.entity';
import { PackageController } from './packages.controller';
import { PackageHandler } from './packages.handler';
import { PackagesService } from './packages.service';
import { PlanningsModule } from '../../pub/plannings/plannings.module';
import { SpotsModule } from '../../products/products.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderPackage.name, schema: PackageSchema },
    ]),
    forwardRef(() => PlanningsModule),
    forwardRef(() => SpotsModule),
    NotificationsModule,
    UsersModule,
  ],
  controllers: [PackageController],
  providers: [PackagesService, PackageHandler],
  exports: [PackagesService],
})
export class PackagesModule {}
