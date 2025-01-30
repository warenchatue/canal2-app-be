import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBroadcastAuthorizationNatureDto } from './dto/create-broadcast-authorization-nature.dto';
import { UpdateBroadcastAuthorizationNatureDto } from './dto/update-broadcast-authorization-nature.dto';
import { BroadcastAuthorizationNature } from './entities/broadcast-authorization-nature.entity';

@Injectable()
export class BroadcastAuthorizationNatureService {
  constructor(
    @InjectModel(BroadcastAuthorizationNature.name)
    private readonly broadcastAuthorizationNatureModel: Model<BroadcastAuthorizationNature>,
  ) {}

  create(
    createBroadcastAuthorizationNatureDto: CreateBroadcastAuthorizationNatureDto,
  ) {
    return this.broadcastAuthorizationNatureModel.create(
      createBroadcastAuthorizationNatureDto,
    );
  }

  findAll() {
    return this.broadcastAuthorizationNatureModel.find().exec();
  }

  findOne(id: string) {
    return this.broadcastAuthorizationNatureModel.findById(id).exec();
  }

  update(
    id: string,
    updateBroadcastAuthorizationNatureDto: UpdateBroadcastAuthorizationNatureDto,
  ) {
    return this.broadcastAuthorizationNatureModel
      .findByIdAndUpdate(id, updateBroadcastAuthorizationNatureDto, {
        new: true,
      })
      .exec();
  }

  remove(id: string) {
    return this.broadcastAuthorizationNatureModel.findByIdAndRemove(id).exec();
  }
}
