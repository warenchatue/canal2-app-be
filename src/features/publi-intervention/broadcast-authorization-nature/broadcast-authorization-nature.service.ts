import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBroadcastAuthorizationNatureDto } from './dto/create-broadcast-authorization-nature.dto';
import { UpdateBroadcastAuthorizationNatureDto } from './dto/update-broadcast-authorization-nature.dto';
import { PaginationFilterBroadcastAuthorizationNatureDto } from './dto/pagination-filter-broadcast-authorization-nature.dto';
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

  findAll(paginationFilter: PaginationFilterBroadcastAuthorizationNatureDto) {
    const { page, limit, search, scope } = paginationFilter;
    const query = this.broadcastAuthorizationNatureModel.find({
      deleted: false,
    });

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
    return this.broadcastAuthorizationNatureModel
      .findOne({ _id: id, deleted: false })
      .exec();
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
    return this.broadcastAuthorizationNatureModel
      .findByIdAndUpdate(id, { deleted: true }, { new: true })
      .exec();
  }
}
