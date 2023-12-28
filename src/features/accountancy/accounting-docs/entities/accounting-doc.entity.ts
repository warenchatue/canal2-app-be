import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { User } from 'src/features/users/entities/user.entity';
import { AccountingDocItem } from './accounting-doc-item.entity';
@Schema({
  timestamps: true,
})
export class AccountingDoc extends BaseSchema {
  @Prop()
  label: string;

  @Prop()
  code: string;

  @Prop()
  date: string;

  @Prop()
  description: string;

  @Prop()
  team: string;

  @Prop()
  amount: number;

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: 'AccountingDocItem' }] })
  items: sc.Types.ObjectId[];

  @Prop({ type: sc.Types.ObjectId, ref: 'Account' })
  paymentAccount: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: 'Org' })
  org: sc.Types.ObjectId;

  @Prop()
  status: string;

  @Prop({ default: false })
  closed: boolean;

  @Prop({ default: false })
  beneficiaryValidated: boolean;

  @Prop({ default: false })
  authorizerValidated: boolean;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  creator: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  authorizer: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  validator: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  beneficiary: sc.Types.ObjectId;
}

export type AccountingDocDocument = AccountingDoc & Document;
export const AccountingDocSchema = SchemaFactory.createForClass(AccountingDoc);
