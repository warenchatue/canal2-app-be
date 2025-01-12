import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { AssetFloor, AssetFloorDocument } from './entities/asset-floor.entity';
import { CreateAssetFloorDto } from './dto/create-asset-floor.dto';
import { UpdateAssetFloorDto } from './dto/update-asset-floor.dto';

@Injectable()
export class AssetFloorService extends DeletableMixin<AssetFloor> {
  constructor(
    @InjectModel(AssetFloor.name)
    private readonly assetFloor: Model<AssetFloorDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateAssetFloorDto) {
    return this.assetFloor.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.assetFloor.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return this.assetFloor.find().where('state').in(states).exec();
  }

  findAll() {
    return this.assetFloor.find().exec();
  }

  async update(_id: string, dto: UpdateAssetFloorDto) {
    return await this.assetFloor
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
