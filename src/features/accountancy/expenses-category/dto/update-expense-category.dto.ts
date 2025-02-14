import { OmitType } from '@nestjs/swagger';
import { CreateExpenseCategoryDto } from './create-expense-category.dto';

export class UpdateExpenseCategoryDto extends OmitType(
  CreateExpenseCategoryDto,
  [],
) {}
