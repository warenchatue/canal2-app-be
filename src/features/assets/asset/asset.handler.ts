import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { Asset } from './entities/asset.entity';

@Injectable()
export class AssetHandler extends BaseHandler {
  constructor() {
    super(AssetHandler.name);
  }

  @OnEvent('assetCategory.created')
  handleArticleCreated(payload: Asset) {
    this.logger.log(`AssetCategory ${payload.name} created.`);
  }
}
