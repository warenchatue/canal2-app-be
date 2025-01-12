import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { AssetRoom, AssetRoomDocument } from './entities/asset-room.entity';
import { UpdateAssetRoomDto } from './dto/update-asset-room.dto';
import { CreateAssetRoomDto } from './dto/create-asset-room.dto';

@Injectable()
export class AssetRoomService extends DeletableMixin<AssetRoom> {
  constructor(
    @InjectModel(AssetRoom.name)
    private readonly assetRoom: Model<AssetRoomDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateAssetRoomDto) {
    return this.assetRoom.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.assetRoom.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return this.assetRoom
      .find()
      .where('state')
      .in(states)
      .populate([
        {
          path: 'floor',
          model: 'AssetFloor',
        },
      ])
      .exec();
  }

  findAll() {
    return this.assetRoom
      .find()
      .populate([
        {
          path: 'floor',
          model: 'AssetFloor',
        },
      ])
      .exec();
  }

  async update(_id: string, dto: UpdateAssetRoomDto) {
    return await this.assetRoom
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
