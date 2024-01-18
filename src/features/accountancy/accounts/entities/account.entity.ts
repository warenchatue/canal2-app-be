import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, PopulateOptions } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';

export enum AccountJournal {
  purchaseJournal = 'purchaseJournal',
  saleJournal = 'saleJournal',
  treasuryJournal = 'treasuryJournal',
  otherOperationJournal = 'otherOperationJournal',
}

@Schema({ timestamps: true })
export class Account extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  label: string;

  @Prop()
  position: string;

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
