import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBroadcastAuthorizationDto } from './dto/create-broadcast-authorization.dto';
import { UpdateBroadcastAuthorizationDto } from './dto/update-broadcast-authorization.dto';
import { PaginationFilterBroadcastAuthorizationDto } from './dto/pagination-filter-broadcast-authorization.dto';
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

  findAll(paginationFilter: PaginationFilterBroadcastAuthorizationDto) {
    const { page, limit, search, scope } = paginationFilter;
    const query = this.broadcastAuthorizationModel.find({ deleted: false });

    if (search) {
      query.where('name').regex(new RegExp(search, 'i'));
    }

    if (scope && scope !== 'all') {
      query.where('type').equals(scope);
    }

    return query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  findOne(id: string) {
    return this.broadcastAuthorizationModel
      .findOne({ _id: id, deleted: false })
      .exec();
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
    return this.broadcastAuthorizationModel
      .findByIdAndUpdate(id, { deleted: true }, { new: true })
      .exec();
  }
}
