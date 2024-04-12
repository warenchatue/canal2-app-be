import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, PopulateOptions } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';

@Schema({ timestamps: true })
export class ProgramCategory extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  color: string;

  @Prop()
  colorCode: string;

  @Prop()
  description: string;
}

export type ProgramCategoryDocument = ProgramCategory & Document;
export const ProgramCategorySchema =
  SchemaFactory.createForClass(ProgramCategory);

export const ARTICLE_POPULATION = {
  model: 'ProgramCategory',
  select: ['name', 'description'],
} as PopulateOptions;
