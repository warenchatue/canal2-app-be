import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';

@Schema({ timestamps: true })
export class HrAddress extends BaseSchema {
  @Prop()
  name: string;

  @Prop()
  street: string;

  @Prop()
  city: string;

  @Prop()
  description: string;
}

export type HrAddressDocument = HrAddress & Document;
export const HrAddressSchema = SchemaFactory.createForClass(HrAddress);
