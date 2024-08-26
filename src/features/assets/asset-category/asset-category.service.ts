import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import {
  AssetCategory,
  AssetCategoryDocument,
} from './entities/asset-category.entity';
import { CreateAssetCategoryDto } from './dto/create-asset-category.dto';
import { UpdateAssetCategoryDto } from './dto/update-asset-category.dto';

@Injectable()
export class AssetCategoryService extends DeletableMixin<AssetCategory> {
  constructor(
    @InjectModel(AssetCategory.name)
    private readonly assetCategory: Model<AssetCategoryDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateAssetCategoryDto) {
    return this.assetCategory.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.assetCategory.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return this.assetCategory
      .find()
      .where('state')
      .in(states)
      .populate([
        {
          path: 'parent',
          model: 'AssetCategory',
        },
      ])
      .exec();
  }

  findAll() {
    return this.assetCategory
      .find()
      .populate([
        {
          path: 'category',
          model: 'AssetCategory',
        },
      ])
      .exec();
  }

  async update(_id: string, dto: UpdateAssetCategoryDto) {
    return await this.assetCategory
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
