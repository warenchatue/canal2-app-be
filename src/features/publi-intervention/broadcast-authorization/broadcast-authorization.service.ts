import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBroadcastAuthorizationDto } from './dto/create-broadcast-authorization.dto';
import { UpdateBroadcastAuthorizationDto } from './dto/update-broadcast-authorization.dto';
import { PaginationFilterBroadcastAuthorizationDto } from './dto/pagination-filter-broadcast-authorization.dto';
import { BroadcastAuthorization } from './entities/broadcast-authorization.entity';
import { ServiceDeleteAbstract } from 'src/common/abstracts/service-delete.abstract';
import { State } from 'src/common/shared/base-schema';

@Injectable()
export class BroadcastAuthorizationService extends ServiceDeleteAbstract<BroadcastAuthorization> {
  constructor(
    @InjectModel(BroadcastAuthorization.name)
    private readonly broadcastAuthorizationModel: Model<BroadcastAuthorization>,
  ) {
    super();
  }

  async create(
    createBroadcastAuthorizationDto: CreateBroadcastAuthorizationDto,
  ) {
    const createdBroadcastAuth = await this.broadcastAuthorizationModel.create(
      createBroadcastAuthorizationDto,
    );

    // Return the created document's ID and a success message
    return {
      statusCode: 201, // HTTP status code for successful creation
      message: 'Broadcast authorization created successfully',
      data: {
        id: createdBroadcastAuth._id, // Return the created document's ID
      },
    };
  }

  findActive(states = [State.active]) {
    return this.broadcastAuthorizationModel
      .find()
      .populate([
        { path: 'announcer', model: 'Announcer' },
        { path: 'invoice', model: 'Invoice' },
        { path: 'campaign', model: 'Campaign' },
        { path: 'nature', model: 'BroadcastAuthorizationNature' },
        { path: 'paymentMethod', model: 'PaymentMethod' },
        { path: 'validator', model: 'User' },
        { path: 'adminValidator', model: 'User' },
        { path: 'commercials', model: 'User' },
        { path: 'productionPartner', model: 'ProductionPartner' },
        { path: 'keyContact', model: 'User' },
      ])
      .where('state')
      .in(states)
      .exec();
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
      .populate([
        { path: 'announcer', model: 'Announcer' },
        { path: 'invoice', model: 'Invoice' },
        { path: 'campaign', model: 'Campaign' },
        { path: 'nature', model: 'BroadcastAuthorizationNature' },
        { path: 'paymentMethod', model: 'PaymentMethod' },
        { path: 'validator', model: 'User' },
        { path: 'adminValidator', model: 'User' },
        { path: 'commercials', model: 'User' },
        { path: 'productionPartner', model: 'ProductionPartner' },
        { path: 'keyContact', model: 'User' },
      ])
      .exec();
  }

  findOne(id: string) {
    return this.broadcastAuthorizationModel
      .findOne({ _id: id, deleted: false })
      .populate([
        { path: 'announcer', model: 'Announcer' },
        { path: 'invoice', model: 'Invoice' },
        { path: 'campaign', model: 'Campaign' },
        { path: 'nature', model: 'BroadcastAuthorizationNature' },
        { path: 'paymentMethod', model: 'PaymentMethod' },
        { path: 'validator', model: 'User' },
        { path: 'adminValidator', model: 'User' },
        { path: 'commercials', model: 'User' },
        { path: 'productionPartner', model: 'ProductionPartner' },
        { path: 'keyContact', model: 'User' },
      ])
      .exec();
  }

  update(
    id: string,
    updateBroadcastAuthorizationDto: UpdateBroadcastAuthorizationDto,
  ) {
    return this.broadcastAuthorizationModel
      .findByIdAndUpdate(id, updateBroadcastAuthorizationDto, { new: true })
      .orFail()
      .exec();
  }
}

//   remove(id: string) {
//     return this.broadcastAuthorizationModel
//       .findByIdAndUpdate(id, { deleted: true }, { new: true })
//       .exec();
//   }
//}
