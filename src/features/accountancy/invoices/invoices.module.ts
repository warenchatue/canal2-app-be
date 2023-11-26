import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from '../../notifications/notifications.module';
import { UsersModule } from '../../users/users.module';
import { PackageController } from './invoices.controller';
import { PackageHandler } from './invoices.handler';
import { InvoicesService } from './invoices.service';
import { PlanningsModule } from '../../pub/plannings/plannings.module';
import { SpotsModule } from '../../products/products.module';
import { Invoice, InvoiceSchema } from './entities/invoice.entity';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    forwardRef(() => PlanningsModule),
    forwardRef(() => SpotsModule),
    NotificationsModule,
    UsersModule,
  ],
  controllers: [PackageController],
  providers: [InvoicesService, PackageHandler],
  exports: [InvoicesService],
})
export class PackagesModule {}
