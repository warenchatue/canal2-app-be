import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import {
  Supplier,
  SupplierDocument,
} from 'src/features/suppliers/entities/supplier.entity';
import { User } from 'src/features/users/entities/user.entity';
@Schema({
  timestamps: true,
})
export class PurchaseOrder extends BaseSchema {
  @Prop()
  label: string;

  @Prop()
  team: string;

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
  contractUrl: string;

  @Prop()
  amount: number;

  @Prop({ type: [{ type: sc.Types.Mixed }] })
  items: sc.Types.Mixed[] | any[];

  @Prop({ type: sc.Types.ObjectId, ref: 'PaymentMethod' })
  paymentMethod: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: 'PaymentCondition' })
  paymentCondition: sc.Types.ObjectId;

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

export type PurchaseOrderDocument = PurchaseOrder & Document;
export const PurchaseOrderSchema = SchemaFactory.createForClass(PurchaseOrder);
