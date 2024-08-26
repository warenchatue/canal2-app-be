import { OmitType } from '@nestjs/swagger';
import { CreateProgramCategoryDto } from './create-program-category.dto';

export class UpdateProgramCategoryDto extends OmitType(
  CreateProgramCategoryDto,
  [],
) {}
