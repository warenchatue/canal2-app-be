import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';

@Schema({ timestamps: true })
export class PaymentMethod extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  label: string;

  @Prop()
  position: string;

  @Prop()
  description: string;

  // @Prop({ type: sc.Types.ObjectId, ref: () => Country })
  // category: sc.Types.ObjectId | string;
}

export type PaymentMethodDocument = PaymentMethod & Document;
export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod);
