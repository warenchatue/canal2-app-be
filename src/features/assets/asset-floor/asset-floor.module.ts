import { Module } from '@nestjs/common';
import { AssetFloorService } from './asset-floor.service';
import { AssetFloorController } from './asset-floor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetFloorHandler } from './asset-floor.handler';
import { AssetFloor, AssetFloorSchema } from './entities/asset-floor.entity';
// import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AssetFloor.name, schema: AssetFloorSchema },
    ]),
  ],
  controllers: [AssetFloorController],
  providers: [AssetFloorService, AssetFloorHandler],
  exports: [AssetFloorService],
})
export class AssetFloorModule {}
