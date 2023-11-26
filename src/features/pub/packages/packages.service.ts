import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceDeleteAbstract } from 'src/common/abstracts/service-delete.abstract';
import { USER_POPULATION } from '../../users/entities/user.entity';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { OrderPackage, PackageDocument } from './entities/package.entity';
import { State } from 'src/common/shared/base-schema';

@Injectable()
export class PackagesService extends ServiceDeleteAbstract<OrderPackage> {
  constructor(
    @InjectModel(OrderPackage.name)
    private readonly packages: Model<PackageDocument>,
  ) {
    super();
  }

  create(dto: CreatePackageDto) {
    return this.packages.create({ ...dto });
  }

  findOne(_id) {
    const population = [
      { path: 'creator', model: 'User' },
      { path: 'manager', model: 'User' },
      { path: 'announcer', model: 'Announcer' },
      {
        path: 'products',
        model: 'Product',
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
      { path: 'announcer', model: 'Announcer' },
      {
        path: 'products',
        model: 'Product',
      },
      {
        path: 'plannings',
        model: 'Planning',
      },
    ];
    return this.packages
      .find()
      .populate(population)
      .where('state')
      .in(states)
      .exec();
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
