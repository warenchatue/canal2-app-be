import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { Asset, AssetDocument } from './entities/asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetService extends DeletableMixin<Asset> {
  constructor(
    @InjectModel(Asset.name)
    private readonly asset: Model<AssetDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateAssetDto) {
    return this.asset.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.asset.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return this.asset
      .find()
      .where('state')
      .in(states)
      .populate([
        {
          path: 'category',
          model: 'AssetCategory',
        },
        {
          path: 'brand',
          model: 'AssetBrand',
        },
        {
          path: 'model',
          model: 'AssetModel',
        },
        {
          path: 'room',
          model: 'AssetRoom',
        },
      ])
      .exec();
  }

  findAll() {
    return this.asset.find().exec();
  }

  async update(_id: string, dto: UpdateAssetDto) {
    return await this.asset
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
