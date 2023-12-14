import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, PopulateOptions } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';

@Schema({ timestamps: true })
export class ArticleCategory extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  description: string;
}

export type ArticleCategoryDocument = ArticleCategory & Document;
export const ArticleCategorySchema =
  SchemaFactory.createForClass(ArticleCategory);

export const ARTICLE_POPULATION = {
  model: 'ArticleCategory',
  select: ['name', 'description'],
} as PopulateOptions;
