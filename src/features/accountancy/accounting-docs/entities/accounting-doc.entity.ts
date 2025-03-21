import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { User } from 'src/features/users/entities/user.entity';
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
  ref: string;

  @Prop()
  invoiceNumber: string;

  @Prop()
  extBeneficiary: string;

  @Prop()
  team: string;

  @Prop()
  amount: number;

  @Prop({ type: [{ type: sc.Types.Mixed }] })
  items: sc.Types.Mixed[];

  @Prop({ type: sc.Types.ObjectId, ref: 'DocType' })
  docType: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: 'Journal' })
  journal: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: 'ExpenseCategory' })
  category: sc.Types.ObjectId;

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
