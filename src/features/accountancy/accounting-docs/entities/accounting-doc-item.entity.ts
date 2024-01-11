import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
@Schema({
  timestamps: true,
})
export class AccountingDocItem extends BaseSchema {
  @Prop()
  label: string;

  @Prop({ type: sc.Types.ObjectId, ref: 'Account' })
  account: sc.Types.ObjectId;

  @Prop()
  amount: number;

  @Prop()
  debit: number;

  @Prop()
  credit: number;
}

export type AccountingDocItemDocument = AccountingDocItem & Document;
export const AccountingDocItemSchema =
  SchemaFactory.createForClass(AccountingDocItem);
