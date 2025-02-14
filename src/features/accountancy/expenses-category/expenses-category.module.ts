import { Module } from '@nestjs/common';
import { ExpenseCategoryService } from './expenses-category.service';
import { ExpenseCategoryController } from './expenses-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseCategoryHandler } from './expenses-category.handler';
import {
  ExpenseCategory,
  ExpenseCategorySchema,
} from './entities/expense-category.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExpenseCategory.name, schema: ExpenseCategorySchema },
    ]),
  ],
  controllers: [ExpenseCategoryController],
  providers: [ExpenseCategoryService, ExpenseCategoryHandler],
  exports: [ExpenseCategoryService],
})
export class ExpenseCategoryModule {}
