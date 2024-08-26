import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { AssetBrand } from './entities/asset-brand.entity';

@Injectable()
export class AssetBrandHandler extends BaseHandler {
  constructor() {
    super(AssetBrandHandler.name);
  }

  @OnEvent('assetModel.created')
  handleArticleCreated(payload: AssetBrand) {
    this.logger.log(`AssetModel ${payload.name} created.`);
  }
}
