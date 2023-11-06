import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { ProductType } from 'src/features/products/entities/product.entity';

@Schema({ timestamps: true })
export class Hour extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop({ default: ProductType.SPOT })
  type: ProductType;

  @Prop()
  description: string;
}

export type HourDocument = Hour & Document;
export const HourSchema = SchemaFactory.createForClass(Hour);
