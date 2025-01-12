import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { AssetFloor } from './entities/asset-floor.entity';

@Injectable()
export class AssetFloorHandler extends BaseHandler {
  constructor() {
    super(AssetFloorHandler.name);
  }

  @OnEvent('assetFloor.created')
  handleArticleCreated(payload: AssetFloor) {
    this.logger.log(`AssetFloor ${payload.name} created.`);
  }
}
