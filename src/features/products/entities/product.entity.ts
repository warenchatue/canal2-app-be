import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { Order } from 'src/features/orders/entities/order.entity';
import { Campaign } from 'src/features/pub/packages/entities/package.entity';

export enum ProductType {
  BA = 'BA',
  SPOT = 'SPOT',
}

@Schema({ timestamps: true })
export class Product extends BaseSchema {
  @Prop()
  date: string;

  @Prop()
  product: string;

  @Prop()
  message: string;

  @Prop()
  file: string;

  @Prop()
  duration: string;

  @Prop({ default: ProductType.SPOT })
  type: ProductType;

  @Prop({ default: '' })
  tag: string;

  @Prop({ default: false })
  isPlay: boolean;

  @Prop({ type: sc.Types.ObjectId, ref: () => Campaign })
  package: sc.Types.ObjectId | string;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
