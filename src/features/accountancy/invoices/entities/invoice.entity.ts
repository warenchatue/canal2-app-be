import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import {
  Announcer,
  AnnouncerDocument,
} from 'src/features/announcers/entities/announcer.entity';
import { Order } from 'src/features/orders/entities/order.entity';
import { Transaction } from 'src/features/transactions/entities/transaction.entity';
import { User } from 'src/features/users/entities/user.entity';
@Schema({
  timestamps: true,
})
export class Invoice extends BaseSchema {
  @Prop()
  label: string;

  @Prop()
  code: string;

  @Prop()
  description: string;

  @Prop()
  amount: number;

  @Prop()
  team: string;

  @Prop()
  paid: number;

  @Prop({ type: [{ type: sc.Types.Mixed }] })
  items: sc.Types.Mixed[] | any[];

  @Prop({ type: sc.Types.ObjectId, ref: 'PaymentMethod' })
  paymentMethod: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: 'PaymentCondition' })
  paymentCondition: sc.Types.ObjectId;

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => Transaction }] })
  transactions: sc.Types.ObjectId[] | string[];

  @Prop({ type: sc.Types.ObjectId, ref: () => Order })
  order: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: 'Org' })
  org: sc.Types.ObjectId;

  @Prop()
  status: string;

  @Prop({ default: false })
  closed: boolean;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  creator: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  manager: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => Announcer })
  announcer: sc.Types.ObjectId | AnnouncerDocument;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  validator: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  adminValidator: sc.Types.ObjectId;

  @Prop({ default: false })
  requiredAdminValidator: boolean;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  expectedAdminValidator: sc.Types.ObjectId;
}

export type InvoiceDocument = Invoice & Document;
export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
