import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './products.service';
import { SpotsController } from './products.controller';
import { Product, ProductSchema } from './entities/product.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsHandler } from './products.handler';
import { PackagesModule } from '../orders/orders.module';
// import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    forwardRef(() => PackagesModule),
  ],
  controllers: [SpotsController],
  providers: [ProductService, ProductsHandler],
  exports: [ProductService],
})
export class SpotsModule {}
