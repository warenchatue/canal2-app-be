import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBroadcastAuthorizationDto } from './dto/create-broadcast-authorization.dto';
import { UpdateBroadcastAuthorizationDto } from './dto/update-broadcast-authorization.dto';
import { BroadcastAuthorization } from './entities/broadcast-authorization.entity';
import { ServiceDeleteAbstract } from 'src/common/abstracts/service-delete.abstract';
import { State } from 'src/common/shared/base-schema';

@Injectable()
export class BroadcastAuthorizationService extends ServiceDeleteAbstract<BroadcastAuthorization> {
  constructor(
    @InjectModel(BroadcastAuthorization.name)
    private readonly broadcastAuthorization: Model<BroadcastAuthorization>,
  ) {
    super();
  }

  async create(dto: CreateBroadcastAuthorizationDto) {
    const createdBroadcastAuth = await this.broadcastAuthorization.create(dto);

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
    return this.broadcastAuthorization
      .find()
      .populate([
        { path: 'announcer', model: 'Announcer' },
        { path: 'invoice', model: 'Invoice' },
        { path: 'campaign', model: 'Campaign' },
        { path: 'nature', model: 'BroadcastAuthorizationNature' },
        { path: 'paymentMethod', model: 'PaymentMethod' },
        { path: 'org', model: 'Org' },
        { path: 'validator', model: 'User' },
        { path: 'commercials', model: 'User' },
      ])
      .where('state')
      .in(states)
      .exec();
  }

  findAllLightNP(states = [State.active]) {
    const BroadCasAuthFilter = {
      ...{ state: { $in: states } },
      campaign: { $exists: true, $ne: null },
    };
    return this.broadcastAuthorization
      .find(BroadCasAuthFilter)
      .select('campaign')
      .lean() // "Converts the results into native JavaScript objects (faster)." 🚀
      .then((results) => results.map((doc) => doc.campaign.toString()));
  }

  findAll() {
    return this.broadcastAuthorization
      .find({ deleted: false })
      .populate([
        { path: 'announcer', model: 'Announcer' },
        { path: 'invoice', model: 'Invoice' },
        { path: 'campaign', model: 'Campaign' },
        { path: 'nature', model: 'BroadcastAuthorizationNature' },
        { path: 'paymentMethod', model: 'PaymentMethod' },
        { path: 'org', model: 'Org' },
        { path: 'validator', model: 'User' },
        { path: 'commercials', model: 'User' },
      ])
      .lean()
      .exec();
  }

  findOne(id: string) {
    return this.broadcastAuthorization
      .findOne({ _id: id, deleted: false })
      .populate([
        { path: 'announcer', model: 'Announcer' },
        { path: 'invoice', model: 'Invoice' },
        { path: 'campaign', model: 'Campaign' },
        { path: 'nature', model: 'BroadcastAuthorizationNature' },
        { path: 'paymentMethod', model: 'PaymentMethod' },
        { path: 'org', model: 'Org' },
        { path: 'validator', model: 'User' },
        { path: 'commercials', model: 'User' },
      ])
      .orFail()
      .exec();
  }

  update(
    id: string,
    updateBroadcastAuthorizationDto: UpdateBroadcastAuthorizationDto,
  ) {
    return this.broadcastAuthorization
      .findByIdAndUpdate(id, updateBroadcastAuthorizationDto, { new: true })
      .orFail()
      .exec();
  }

  async validateAuthorization(id: string, userId: string) {
    return this.broadcastAuthorization
      .findByIdAndUpdate(
        id,
        {
          validated: true,
          validatedBy: userId,
        },
        { new: true },
      )
      .populate([
        { path: 'announcer', model: 'Announcer' },
        { path: 'invoice', model: 'Invoice' },
        { path: 'campaign', model: 'Campaign' },
        { path: 'nature', model: 'BroadcastAuthorizationNature' },
        { path: 'paymentMethod', model: 'PaymentMethod' },
        { path: 'org', model: 'Org' },
        { path: 'validator', model: 'User' },
        { path: 'commercials', model: 'User' },
        { path: 'validatedBy', model: 'User' },
      ])
      .orFail()
      .exec();
  }
}
