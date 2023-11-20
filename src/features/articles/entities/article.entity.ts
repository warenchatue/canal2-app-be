import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, PopulateOptions, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { Country } from 'src/features/countries/entities/country.entity';

@Schema({ timestamps: true })
export class Article extends BaseSchema {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: sc.Types.ObjectId, ref: () => Country })
  category: sc.Types.ObjectId | string;
}

export type ArticleDocument = Article & Document;
export const ArticleSchema = SchemaFactory.createForClass(Article);

export const ARTICLE_POPULATION = {
  model: 'Article',
  select: ['name', 'description'],
} as PopulateOptions;
