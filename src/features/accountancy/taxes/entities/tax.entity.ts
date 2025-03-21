import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, PopulateOptions } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';

@Schema({ timestamps: true })
export class Tax extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  value: string;

  @Prop()
  description: string;
}

export type TaxDocument = Tax & Document;
export const TaxSchema = SchemaFactory.createForClass(Tax);

export const TAX_POPULATION = {
  model: 'Tax',
  select: ['name', 'description'],
} as PopulateOptions;
