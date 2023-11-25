import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, AnyObject, FilterQuery, Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';
import { Org, OrgDocument } from './entities/org.entity';

const POPULATION_DATA = ['owner', 'members', 'banned', 'administrators'];

@Injectable()
export class OrgsService extends DeletableMixin<Org> {
  constructor(
    @InjectModel(Org.name)
    private readonly orgs: Model<OrgDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateOrgDto, owner: string) {
    return this.orgs.create({ ...dto, owner });
  }

  findOne(_id: string, populate = false) {
    const query = this.orgs.findById(_id).orFail();
    return populate ? query.populate(POPULATION_DATA).exec() : query.exec();
  }

  findBySlug(slug: string, populate = false) {
    const query = this.orgs.findOne({ slug }).orFail();
    return populate ? query.populate(POPULATION_DATA).exec() : query.exec();
  }

  findAll() {
    return this.orgs
      .find()
      .populate([
        {
          path: 'country',
          model: 'Country',
        },
      ])
      .where('state')
      .in([State.active]);
  }

  async isMemberOf(
    accountId: string,
    orgId: string,
    includePending = false,
  ): Promise<boolean> {
    try {
      const filter: FilterQuery<OrgDocument>[] = [
        { administrators: accountId },
        { owner: accountId },
        { members: accountId },
      ];

      if (includePending) {
        filter.push({ pending: accountId });
      }
      await this.orgs
        .findOne({
          $and: [
            { _id: orgId },
            {
              $or: filter,
            },
          ],
        })
        .orFail()
        .exec();
      return true;
    } catch (ex) {
      return false;
    }
  }

  getMembers(_id: string, all = true) {
    const selects = ['members', 'owner', 'administrators'];
    if (all) {
      selects.push('banned', 'pending');
    }
    return this.orgs
      .findById(_id)
      .select(selects)
      .populate(POPULATION_DATA)
      .orFail()
      .exec();
  }

  pushMembers(_id: string, members: string[]) {
    return this.orgs
      .findByIdAndUpdate(_id, { $push: { members } }, { new: true })
      .orFail()
      .exec();
  }

  pushCode(_id: string, code: string) {
    return this.orgs
      .findByIdAndUpdate(_id, { $push: { codes: code } }, { new: true })
      .orFail()
      .exec();
  }

  findNotifications(_id: string) {
    return this.orgs
      .findById(_id)
      .select('notifications')
      .populate('notifications')
      .orFail()
      .exec();
  }

  updateOrg(_id: string, dto: UpdateOrgDto) {
    return this.orgs.findByIdAndUpdate(_id, { $set: dto });
  }

  pull(_id: string, dto: AnyKeys<OrgDocument> & AnyObject) {
    return this.orgs
      .findByIdAndUpdate(_id, { $pullAll: dto }, { new: true })
      .orFail()
      .exec();
  }

  push(_id: string, dto: UpdateOrgDto) {
    return this.orgs
      .findByIdAndUpdate(_id, { $push: dto }, { new: true })
      .orFail()
      .exec();
  }

  async findMembersIds(_id: string) {
    const result = await this.orgs
      .findById(_id)
      .select(['members', 'owner'])
      .orFail()
      .exec();
    return [result.owner, ...result.members];
  }
}
