import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { AssetModel, AssetModelDocument } from './entities/asset-model.entity';
import { CreateAssetModelDto } from './dto/create-asset-model.dto';
import { UpdateAssetModelDto } from './dto/update-asset-model.dto';

@Injectable()
export class AssetModelService extends DeletableMixin<AssetModel> {
  constructor(
    @InjectModel(AssetModel.name)
    private readonly assetModel: Model<AssetModelDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateAssetModelDto) {
    return this.assetModel.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.assetModel.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return this.assetModel.find().where('state').in(states).exec();
  }

  findAll() {
    return this.assetModel.find().exec();
  }

  async update(_id: string, dto: UpdateAssetModelDto) {
    return await this.assetModel
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
