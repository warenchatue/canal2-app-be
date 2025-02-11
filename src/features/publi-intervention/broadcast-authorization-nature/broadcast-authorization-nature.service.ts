import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBroadcastAuthorizationNatureDto } from './dto/create-broadcast-authorization-nature.dto';
import { UpdateBroadcastAuthorizationNatureDto } from './dto/update-broadcast-authorization-nature.dto';
import { PaginationFilterBroadcastAuthorizationNatureDto } from './dto/pagination-filter-broadcast-authorization-nature.dto';
import { BroadcastAuthorizationNature } from './entities/broadcast-authorization-nature.entity';
import { ServiceDeleteAbstract } from 'src/common/abstracts/service-delete.abstract';
import { State } from 'src/common/shared/base-schema';

@Injectable()
export class BroadcastAuthorizationNatureService extends ServiceDeleteAbstract<BroadcastAuthorizationNature> {
  constructor(
    @InjectModel(BroadcastAuthorizationNature.name)
    private readonly broadcastAuthorizationNatureModel: Model<BroadcastAuthorizationNature>,
  ) {
    super();
  }

  create(
    createBroadcastAuthorizationNatureDto: CreateBroadcastAuthorizationNatureDto,
  ) {
    return this.broadcastAuthorizationNatureModel.create(
      createBroadcastAuthorizationNatureDto,
    );
  }

  findActive(states = [State.active]) {
    return this.broadcastAuthorizationNatureModel
      .find()
      .populate([{ path: 'program', model: 'TVProgram' }])
      .where('state')
      .in(states)
      .exec();
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
      .populate([{ path: 'program', model: 'TVProgram' }])
      .exec();
  }

  findOne(id: string) {
    return this.broadcastAuthorizationNatureModel
      .findOne({ _id: id, deleted: false })
      .populate([{ path: 'program', model: 'TVProgram' }])
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
}
//   remove(id: string) {
//     return this.broadcastAuthorizationNatureModel
//       .findByIdAndUpdate(id, { deleted: true }, { new: true })
//       .exec();
//   }
// }
