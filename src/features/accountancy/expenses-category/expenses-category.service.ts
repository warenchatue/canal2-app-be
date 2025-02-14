import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import {
  ExpenseCategory,
  ExpenseCategoryDocument,
} from './entities/expense-category.entity';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';

@Injectable()
export class ExpenseCategoryService extends DeletableMixin<ExpenseCategory> {
  constructor(
    @InjectModel(ExpenseCategory.name)
    private readonly expenseCategory: Model<ExpenseCategoryDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateExpenseCategoryDto) {
    return this.expenseCategory.create({
      ...dto,
    });
  }

  findOne(_id: string) {
    return this.expenseCategory.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return this.expenseCategory
      .find()
      .where('state')
      .in(states)
      .populate([
        {
          path: 'parent',
          model: 'ExpenseCategory',
        },
      ])
      .exec();
  }

  findAll() {
    return this.expenseCategory
      .find()
      .populate([
        {
          path: 'category',
          model: 'ExpenseCategory',
        },
      ])
      .exec();
  }

  async update(_id: string, dto: UpdateExpenseCategoryDto) {
    return await this.expenseCategory
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }
}
