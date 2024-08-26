import { Module } from '@nestjs/common';
import { AssetCategoryService } from './asset-category.service';
import { AssetCategoryController } from './asset-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetCategoryHandler } from './asset-category.handler';
import {
  AssetCategory,
  AssetCategorySchema,
} from './entities/asset-category.entity';
// import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AssetCategory.name, schema: AssetCategorySchema },
    ]),
  ],
  controllers: [AssetCategoryController],
  providers: [AssetCategoryService, AssetCategoryHandler],
  exports: [AssetCategoryService],
})
export class AssetCategoryModule {}
