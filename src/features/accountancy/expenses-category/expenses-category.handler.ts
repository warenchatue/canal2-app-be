import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { ExpenseCategory } from './entities/expense-category.entity';

@Injectable()
export class ExpenseCategoryHandler extends BaseHandler {
  constructor() {
    super(ExpenseCategoryHandler.name);
  }

  @OnEvent('expenseCategory.created')
  handleArticleCreated(payload: ExpenseCategory) {
    this.logger.log(`ExpenseCategory ${payload.name} created.`);
  }
}
