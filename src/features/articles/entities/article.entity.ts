import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, PopulateOptions, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { ArticleCategory } from 'src/features/article-categories/entities/article-category.entity';

@Schema({ timestamps: true })
export class Article extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  description: string;

  @Prop({ type: sc.Types.ObjectId, ref: () => ArticleCategory })
  category: sc.Types.ObjectId | string;
}

export type ArticleDocument = Article & Document;
export const ArticleSchema = SchemaFactory.createForClass(Article);

export const ARTICLE_POPULATION = {
  model: 'Article',
  select: ['code', 'name'],
} as PopulateOptions;
