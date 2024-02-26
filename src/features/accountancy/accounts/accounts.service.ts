import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account, AccountDocument } from './entities/account.entity';
import * as bcrypt from 'bcrypt';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { SALT_ROUND } from 'src/common/vars';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AccountsService extends DeletableMixin<Account> {
  constructor(
    @InjectModel(Account.name)
    private readonly accounts: Model<AccountDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateAccountDto) {
    return this.accounts.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.accounts.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return (
      this.accounts
        .find()
        .where('state')
        .in(states)
        // .populate([
        //   {
        //     path: 'category',
        //     model: 'Category',
        //   },
        // ])
        .exec()
    );
  }

  findLight(states = [State.active]) {
    return this.accounts
      .find({}, { label: 1, code: 1, position: 1 })
      .where('state')
      .in(states)
      .transform((docs) => {
        return docs.map((doc) => ({
          _id: doc._id.toString(),
          label: doc.label,
          code: doc.code,
          position: doc.position,
        }));
      })
      .exec();
  }

  findAll() {
    return this.accounts.find().exec();
  }

  async update(_id: string, dto: UpdateAccountDto) {
    return await this.accounts
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
