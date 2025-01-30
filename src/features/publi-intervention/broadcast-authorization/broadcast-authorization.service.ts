import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBroadcastAuthorizationDto } from './dto/create-broadcast-authorization.dto';
import { UpdateBroadcastAuthorizationDto } from './dto/update-broadcast-authorization.dto';
import { BroadcastAuthorization } from './entities/broadcast-authorization.entity';

@Injectable()
export class BroadcastAuthorizationService {
  constructor(
    @InjectModel(BroadcastAuthorization.name)
    private readonly broadcastAuthorizationModel: Model<BroadcastAuthorization>,
  ) {}

  create(createBroadcastAuthorizationDto: CreateBroadcastAuthorizationDto) {
    return this.broadcastAuthorizationModel.create(
      createBroadcastAuthorizationDto,
    );
  }

  findAll() {
    return this.broadcastAuthorizationModel.find().exec();
  }

  findOne(id: string) {
    return this.broadcastAuthorizationModel.findById(id).exec();
  }

  update(
    id: string,
    updateBroadcastAuthorizationDto: UpdateBroadcastAuthorizationDto,
  ) {
    return this.broadcastAuthorizationModel
      .findByIdAndUpdate(id, updateBroadcastAuthorizationDto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.broadcastAuthorizationModel.findByIdAndRemove(id).exec();
  }
}
