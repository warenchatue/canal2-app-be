import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { Supplier, SupplierSchema } from './entities/supplier.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { SuppliersHandler } from './suppliers.handler';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Supplier.name, schema: SupplierSchema },
    ]),
  ],
  controllers: [SuppliersController],
  providers: [SuppliersService, SuppliersHandler],
  exports: [SuppliersService],
})
export class SuppliersModule {}
