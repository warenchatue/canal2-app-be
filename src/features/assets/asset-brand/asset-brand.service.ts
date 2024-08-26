import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { AssetBrand, AssetBrandDocument } from './entities/asset-brand.entity';
import { CreateAssetBrandDto } from './dto/create-asset-brand.dto';
import { UpdateAssetBrandDto } from './dto/update-asset-brand.dto';

@Injectable()
export class AssetBrandService extends DeletableMixin<AssetBrand> {
  constructor(
    @InjectModel(AssetBrand.name)
    private readonly assetBrand: Model<AssetBrandDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateAssetBrandDto) {
    return this.assetBrand.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.assetBrand.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return this.assetBrand.find().where('state').in(states).exec();
  }

  findAll() {
    return this.assetBrand.find().exec();
  }

  async update(_id: string, dto: UpdateAssetBrandDto) {
    return await this.assetBrand
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
