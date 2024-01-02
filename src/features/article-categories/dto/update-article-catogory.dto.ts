import { OmitType } from '@nestjs/swagger';
import { CreateArticleCategoryDto } from './create-article-category.dto';

export class UpdateArticleCategoryDto extends OmitType(
  CreateArticleCategoryDto,
  [],
) {}
