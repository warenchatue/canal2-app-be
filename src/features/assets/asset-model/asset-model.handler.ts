import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { AssetModel } from './entities/asset-model.entity';

@Injectable()
export class AssetModelHandler extends BaseHandler {
  constructor() {
    super(AssetModelHandler.name);
  }

  @OnEvent('assetModel.created')
  handleArticleCreated(payload: AssetModel) {
    this.logger.log(`AssetModel ${payload.name} created.`);
  }
}
