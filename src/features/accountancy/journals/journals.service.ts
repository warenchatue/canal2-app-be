import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { CreateJournalDto } from './dto/create-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';
import { Journal, JournalDocument } from './entities/journal.entity';

@Injectable()
export class JournalsService extends DeletableMixin<Journal> {
  constructor(
    @InjectModel(Journal.name)
    private readonly accounts: Model<JournalDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateJournalDto) {
    return this.accounts.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.accounts.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return this.accounts
      .find()
      .where('state')
      .in(states)
      .populate([
        {
          path: 'org',
          model: 'Org',
        },
        {
          path: 'accounts',
          model: 'Account',
        },
      ])
      .exec();
  }

  findAll() {
    return this.accounts
      .find()
      .populate([
        {
          path: 'org',
          model: 'Org',
        },
        {
          path: 'accounts',
          model: 'Account',
        },
      ]).exec();
  }

  async update(_id: string, dto: UpdateJournalDto) {
    return await this.accounts
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
