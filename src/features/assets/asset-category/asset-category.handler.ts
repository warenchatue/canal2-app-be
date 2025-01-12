import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { AssetCategory } from './entities/asset-category.entity';

@Injectable()
export class AssetCategoryHandler extends BaseHandler {
  constructor() {
    super(AssetCategoryHandler.name);
  }
  explo;

  @OnEvent('assetCategory.created')
  handleArticleCreated(payload: AssetCategory) {
    this.logger.log(`AssetCategory ${payload.name} created.`);
  }
}
