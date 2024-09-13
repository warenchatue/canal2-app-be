import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { AssetRoom } from './entities/asset-room.entity';

@Injectable()
export class AssetRoomHandler extends BaseHandler {
  constructor() {
    super(AssetRoomHandler.name);
  }

  @OnEvent('assetRoom.created')
  handleArticleCreated(payload: AssetRoom) {
    this.logger.log(`AssetRoom ${payload.name} created.`);
  }
}
