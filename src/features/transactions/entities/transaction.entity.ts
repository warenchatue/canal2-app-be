import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { Org } from 'src/features/orgs/entities/org.entity';
import { User } from 'src/features/users/entities/user.entity';

export type TransactionDocument = Transaction & Document;

export enum TransactionType {
  sales = 'sales',
  expenses = 'expenses',
}

export enum TransactionStatus {
  onHold = 'onHold',
  inProgress = 'inProgress',
  completed = 'completed',
  canceled = 'canceled',
  failed = 'failed',
}

@Schema({
  timestamps: true,
})
export class Transaction extends BaseSchema {
  @Prop({ required: true })
  amount: number;

  @Prop()
  message: string;

  @Prop({ enum: TransactionType, required: true })
  type: TransactionType;

  @Prop({ enum: TransactionStatus, default: TransactionStatus.onHold })
  status: TransactionStatus;

  @Prop({ default: false })
  approved: boolean;

  @Prop({ type: sc.Types.ObjectId, ref: () => Org })
  org: sc.Types.ObjectId | sc.Types.String;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  author: sc.Types.ObjectId | sc.Types.String;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  validator: sc.Types.ObjectId | sc.Types.String;

  @Prop({ type: sc.Types.Mixed })
  data: sc.Types.Mixed;

  @Prop({ type: sc.Types.Mixed })
  paymentMethod: sc.Types.Mixed;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

export const TRANSACTION_POPULATION = [
  { path: 'org', model: 'Org' },
  { path: 'author', model: 'User' },
  { path: 'validator', model: 'User' },
];
