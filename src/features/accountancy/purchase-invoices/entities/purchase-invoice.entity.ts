import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { Order } from 'src/features/orders/entities/order.entity';
import {
  Supplier,
  SupplierDocument,
} from 'src/features/suppliers/entities/supplier.entity';
import { Transaction } from 'src/features/transactions/entities/transaction.entity';
import { User } from 'src/features/users/entities/user.entity';
@Schema({
  timestamps: true,
})
export class PurchaseInvoice extends BaseSchema {
  @Prop()
  label: string;

  @Prop()
  code: string;

  @Prop()
  date: string;

  @Prop()
  dueDate: string;

  @Prop()
  description: string;

  @Prop()
  note: string;

  @Prop()
  team: string;

  @Prop()
  amountHT: number;

  @Prop()
  amount: number;

  @Prop()
  tva: number;

  @Prop()
  tsp: number;

  @Prop()
  paid: number;

  @Prop({ type: [{ type: sc.Types.Mixed }] })
  items: sc.Types.Mixed[] | any[];

  @Prop({ type: [{ type: sc.Types.Mixed }] })
  taxes: sc.Types.Mixed[];

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

  @Prop({ type: sc.Types.ObjectId, ref: 'PurchaseInvoice' })
  from: sc.Types.ObjectId;

  @Prop()
  status: string;

  @Prop({ default: false })
  closed: boolean;

  @Prop({ default: true })
  isDoit: boolean;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  creator: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  manager: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => Supplier })
  supplier: sc.Types.ObjectId | SupplierDocument;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  validator: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  adminValidator: sc.Types.ObjectId;

  @Prop({ default: false })
  requiredAdminValidator: boolean;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  expectedAdminValidator: sc.Types.ObjectId;
}

export type PurchaseInvoiceDocument = PurchaseInvoice & Document;
export const PurchaseInvoiceSchema =
  SchemaFactory.createForClass(PurchaseInvoice);
