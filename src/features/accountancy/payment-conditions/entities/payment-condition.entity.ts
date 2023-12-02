import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';

@Schema({ timestamps: true })
export class PaymentCondition extends BaseSchema {
  @Prop()
  label: string;

  @Prop()
  delay: number;

  @Prop()
  description: string;

  // @Prop({ type: sc.Types.ObjectId, ref: () => Country })
  // category: sc.Types.ObjectId | string;
}

export type PaymentConditionDocument = PaymentCondition & Document;
export const PaymentConditionSchema =
  SchemaFactory.createForClass(PaymentCondition);
