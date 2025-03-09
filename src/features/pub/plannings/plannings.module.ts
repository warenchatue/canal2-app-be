import { Module, forwardRef } from '@nestjs/common';
import { Planning, PlanningSchema } from './entities/planning.entity';
import { PlanningsService } from './plannings.service';
import { PlanningsController } from './plannings.controller';
import { PlanningsHandler } from './plannings.handler';
import { MongooseModule } from '@nestjs/mongoose';
import { PackagesModule } from '../packages/packages.module';
import { BroadcastAuthorizationService } from 'src/features/publi-intervention/broadcast-authorization/broadcast-authorization.service';
import {
  BroadcastAuthorization,
  BroadcastAuthorizationSchema,
} from 'src/features/publi-intervention/broadcast-authorization/entities/broadcast-authorization.entity';
import {
  Product,
  ProductSchema,
} from 'src/features/products/entities/product.entity';
import { ProductService } from 'src/features/products/products.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Planning.name, schema: PlanningSchema },
    ]),
    MongooseModule.forFeature([
      {
        name: BroadcastAuthorization.name,
        schema: BroadcastAuthorizationSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
    forwardRef(() => PackagesModule),
  ],
  controllers: [PlanningsController],
  providers: [
    PlanningsService,
    BroadcastAuthorizationService,
    ProductService,
    PlanningsHandler,
  ],
  exports: [PlanningsService],
})
export class PlanningsModule {}
