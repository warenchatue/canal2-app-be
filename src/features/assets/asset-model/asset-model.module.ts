import { Module } from '@nestjs/common';
import { AssetModelService } from './asset-model.service';
import { AssetModelController } from './asset-model.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetModelHandler } from './asset-model.handler';
import { AssetModel, AssetModelSchema } from './entities/asset-model.entity';
// import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AssetModel.name, schema: AssetModelSchema },
    ]),
  ],
  controllers: [AssetModelController],
  providers: [AssetModelService, AssetModelHandler],
  exports: [AssetModelService],
})
export class AssetModelModule {}
