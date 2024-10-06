import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';

@Schema({ timestamps: true })
export class ProgramPlanning extends BaseSchema {
  @Prop()
  date: string;

  @Prop()
  position: string;

  @Prop()
  code: string;

  @Prop()
  isManualPlay: boolean;

  @Prop()
  isManualPlayUpdatedBy: string;

  @Prop()
  isAutoPlay: boolean;

  @Prop()
  isTvProgram: boolean;

  @Prop({ type: sc.Types.ObjectId, ref: 'Hour' })
  hour: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: 'TvProgram' })
  tvProgram: sc.Types.ObjectId;

  @Prop()
  playedHour: string;
}

export type ProgramPlanningDocument = ProgramPlanning & Document;
export const ProgramPlanningSchema =
  SchemaFactory.createForClass(ProgramPlanning);
