import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';

@Schema({ timestamps: true })
export class Country extends BaseSchema {
  @Prop()
  name: string;

  @Prop()
  abbr: string;

  @Prop()
  dial: string;

  @Prop()
  flag: string;
}

export type CountryDocument = Country & Document;
export const CountrySchema = SchemaFactory.createForClass(Country);
