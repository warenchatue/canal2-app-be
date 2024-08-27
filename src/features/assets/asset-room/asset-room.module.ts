import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetRoom, AssetRoomSchema } from './entities/asset-room.entity';
import { AssetRoomService } from './asset-room.service';
import { AssetRoomHandler } from './asset-room.handler';
import { AssetRoomController } from './asset-room.controller';
// import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AssetRoom.name, schema: AssetRoomSchema },
    ]),
  ],
  controllers: [AssetRoomController],
  providers: [AssetRoomService, AssetRoomHandler],
  exports: [AssetRoomService],
})
export class AssetRoomModule {}
