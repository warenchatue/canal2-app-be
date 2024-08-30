import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceDeleteAbstract } from 'src/common/abstracts/service-delete.abstract';
import { USER_POPULATION } from '../../users/entities/user.entity';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Campaign, CampaignDocument } from './entities/package.entity';
import { State } from 'src/common/shared/base-schema';
import { FindQueryDto } from 'src/common/dto/find-query.dto';
import { paginate } from 'nestjs-paginate-mongo';

@Injectable()
export class PackagesService extends ServiceDeleteAbstract<Campaign> {
  constructor(
    @InjectModel(Campaign.name)
    private readonly packages: Model<CampaignDocument>,
  ) {
    super();
  }

  create(dto: CreatePackageDto) {
    return this.packages.create({ ...dto });
  }

  findOneNP(_id) {
    return this.packages.findById(_id).orFail().exec();
  }

  findOne(_id) {
    const population = [
      { path: 'creator', model: 'User' },
      { path: 'manager', model: 'User' },
      { path: 'org', model: 'Org' },
      { path: 'adminValidator', model: 'User' },
      {
        path: 'products',
        model: 'Product',
      },
      {
        path: 'tvPrograms',
        model: 'TvProgram',
      },
      {
        path: 'announcer',
        model: 'Announcer',
      },
      {
        path: 'order',
        model: 'Order',
        populate: [
          {
            path: 'announcer',
            model: 'Announcer',
          },
        ],
      },

      {
        path: 'invoice',
        model: 'Invoice',
        populate: [
          {
            path: 'announcer',
            model: 'Announcer',
          },
        ],
      },

      {
        path: 'plannings',
        model: 'Planning',
        populate: [
          {
            path: 'hour',
            model: 'Hour',
          },
          {
            path: 'tvProgram',
            model: 'TvProgram',
          },
          {
            path: 'product',
            model: 'Product',
          },
        ],
      },
    ];
    return this.packages.findById(_id).orFail().populate(population).exec();
  }

  find(states: State[] = [State.active]) {
    const population = [
      { path: 'creator', model: 'User' },
      { path: 'manager', model: 'User' },
      { path: 'org', model: 'Org' },
      { path: 'adminValidator', model: 'User' },
      {
        path: 'announcer',
        model: 'Announcer',
      },
      {
        path: 'order',
        model: 'Order',
        populate: [
          {
            path: 'announcer',
            model: 'Announcer',
          },
        ],
      },

      {
        path: 'invoice',
        model: 'Invoice',
        populate: [
          {
            path: 'announcer',
            model: 'Announcer',
          },
        ],
      },
      {
        path: 'products',
        model: 'Product',
      },
      {
        path: 'tvPrograms',
        model: 'TvProgram',
      },
      {
        path: 'plannings',
        model: 'Planning',
      },
    ];

    return this.packages
      .find()
      .where('state')
      .in(states)
      .populate(population)
      .exec();
  }

  findPaginate(
    query: FindQueryDto<Campaign>,
    states: State[] = [State.active],
  ) {
    const population = [
      { path: 'creator', model: 'User' },
      { path: 'manager', model: 'User' },
      { path: 'org', model: 'Org', select: '_id code name email phone' },
      { path: 'adminValidator', model: 'User' },
      {
        path: 'announcer',
        model: 'Announcer',
        select: '_id code name email phone',
      },
      {
        path: 'order',
        model: 'Order',
        populate: [
          {
            path: 'announcer',
            model: 'Announcer',
            select: '_id code name email phone',
          },
        ],
      },

      {
        path: 'invoice',
        model: 'Invoice',
        populate: [
          {
            path: 'announcer',
            model: 'Announcer',
            select: '_id code name email phone',
          },
        ],
      },
      {
        path: 'products',
        model: 'Product',
      },
      {
        path: 'tvPrograms',
        model: 'TvProgram',
      },
      {
        path: 'plannings',
        model: 'Planning',
      },
    ];
    const { search, perPage, page } = query;

    const searchQuery = search
      ? { 'announcer.name': { $regex: search, $options: 'i' } }
      : {};

    const packageFilter = {
      ...searchQuery,
      ...(states.length > 0 ? { state: { $in: states } } : {}),
    };

    return paginate(
      this.packages
        .find(packageFilter)
        .sort({ ['createdAt']: -1 })
        .populate(population),
      {
        page,
        perPage,
      },
    );
  }

  findByAnnouncer(announcerId: string, states: State[] = [State.active]) {
    const population = [{ path: 'creator', ...USER_POPULATION }];
    return this.packages
      .find({ announcer: announcerId })
      .populate(population)
      .where('state')
      .in([states])
      .exec();
  }

  closePackage(_id: string) {
    return this.packages.findByIdAndUpdate(_id, {
      $set: { closed: true },
    });
  }

  reopenPackage(_id: string) {
    return this.packages.findByIdAndUpdate(_id, {
      $set: { closed: false },
    });
  }

  updateOne(_id: string, dto: UpdatePackageDto) {
    return this.packages.findByIdAndUpdate(_id, {
      $set: dto,
    });
  }

  addTvProgram(_id: string, tvProgramId: string) {
    return this.packages
      .findByIdAndUpdate(_id, { $push: { tvPrograms: tvProgramId } })
      .orFail()
      .exec();
  }

  addProduct(_id: string, productId: string) {
    return this.packages
      .findByIdAndUpdate(_id, { $push: { products: productId } })
      .orFail()
      .exec();
  }

  addPlanning(_id: string, planningId: string) {
    return this.packages
      .findByIdAndUpdate(_id, { $push: { plannings: planningId } })
      .orFail()
      .exec();
  }

  pullProduct(_id: string, productId: string) {
    return this.packages
      .findByIdAndUpdate(_id, { $pull: { products: productId } })
      .orFail()
      .exec();
  }

  pullPlanning(_id: string, planningId: string) {
    return this.packages
      .findByIdAndUpdate(_id, { $pull: { plannings: planningId } })
      .orFail()
      .exec();
  }
}
