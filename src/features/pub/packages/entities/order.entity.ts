import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import {
  Announcer,
  AnnouncerDocument,
} from 'src/features/announcers/entities/announcer.entity';
import { Planning } from 'src/features/plannings/entities/planning.entity';
import { Product } from 'src/features/products/entities/product.entity';
import { User } from 'src/features/users/entities/user.entity';
@Schema({
  timestamps: true,
})
export class Order extends BaseSchema {
  @Prop()
  label: string;

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

  @Prop()
  contractUrl: string;

  @Prop({ type: sc.Types.Mixed })
  items: sc.Types.Mixed | any;

  @Prop({ type: sc.Types.Mixed })
  invoice: sc.Types.Mixed | any;

  @Prop()
  status: string;

  @Prop({ default: false })
  closed: boolean;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  creator: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  manager: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  orderValidator: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  billValidator: sc.Types.ObjectId;

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

  @Prop({ type: sc.Types.ObjectId, ref: () => Announcer })
  announcer: sc.Types.ObjectId | AnnouncerDocument;

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => Product }] })
  products: sc.Types.ObjectId[] | string[];

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => Planning }] })
  plannings: sc.Types.ObjectId[] | string[];
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
