import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, PopulateOptions, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { Country } from 'src/features/countries/entities/country.entity';

@Schema({ timestamps: true })
export class Account extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  // @Prop({ type: sc.Types.ObjectId, ref: () => Country })
  // category: sc.Types.ObjectId | string;
}

export type AccountDocument = Account & Document;
export const AccountSchema = SchemaFactory.createForClass(Account);

export const ACCOUNT_POPULATION = {
  model: 'Account',
  select: ['name', 'description'],
} as PopulateOptions;
