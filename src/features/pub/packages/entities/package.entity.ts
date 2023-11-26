import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { Order } from 'src/features/orders/entities/order.entity';
import { Product } from 'src/features/products/entities/product.entity';
import { Planning } from 'src/features/pub/plannings/entities/planning.entity';
import { User } from 'src/features/users/entities/user.entity';
@Schema({
  timestamps: true,
})
export class OrderPackage extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  numberSpots: number;

  @Prop()
  numberPaid: number;

  @Prop()
  numberProducts: number;

  @Prop()
  numberPlay: number;

  @Prop()
  period: string;

  @Prop()
  description: string;

  @Prop({ type: sc.Types.ObjectId, ref: () => Order })
  order: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => Order })
  invoice: sc.Types.ObjectId;

  @Prop()
  status: string;

  @Prop({ default: false })
  closed: boolean;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  creator: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  manager: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  packageValidator: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  planningValidator: sc.Types.ObjectId;

  @Prop()
  planningValidatorSignature: string;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  adminValidator: sc.Types.ObjectId;

  @Prop({ default: false })
  requiredAdminValidator: boolean;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  expectedAdminValidator: sc.Types.ObjectId;

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => Product }] })
  products: sc.Types.ObjectId[] | string[];

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => Planning }] })
  plannings: sc.Types.ObjectId[] | string[];
}

export type PackageDocument = OrderPackage & Document;
export const PackageSchema = SchemaFactory.createForClass(OrderPackage);
