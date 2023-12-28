import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';

@Schema({ timestamps: true })
export class Planning extends BaseSchema {
  @Prop()
  date: string;

  @Prop()
  position: string;

  @Prop()
  code: string;

  @Prop()
  isManualPlay: boolean;

  @Prop()
  isAutoPlay: boolean;

  @Prop({ type: sc.Types.ObjectId, ref: 'Hour' })
  hour: sc.Types.ObjectId;

  @Prop()
  playedHour: string;

  @Prop({ type: sc.Types.ObjectId, ref: 'Spot' })
  product: sc.Types.ObjectId;
}

export type PlanningDocument = Planning & Document;
export const PlanningSchema = SchemaFactory.createForClass(Planning);
