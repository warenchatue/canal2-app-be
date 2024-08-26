import { Module } from '@nestjs/common';
import { AssetBrandService } from './asset-brand.service';
import { AssetBrandController } from './asset-brand.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetBrandHandler } from './asset-brand.handler';
import { AssetBrand, AssetBrandSchema } from './entities/asset-brand.entity';
// import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AssetBrand.name, schema: AssetBrandSchema },
    ]),
  ],
  controllers: [AssetBrandController],
  providers: [AssetBrandService, AssetBrandHandler],
  exports: [AssetBrandService],
})
export class AssetBrandModule {}
