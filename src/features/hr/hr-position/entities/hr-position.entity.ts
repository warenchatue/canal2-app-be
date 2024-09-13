import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { HrDepartment } from '../../hr-department/entities/hr-department.entity';

export enum HrPositionEmploymentType {
  internShip = 'InternShip',
  contract = 'Contract',
  partTime = 'Part Time',
  fullTime = 'Full Time',
}

export enum HrPositionStatus {
  onHold = 'On Hold',
  open = 'Open',
  filled = 'Filled',
}

@Schema({ timestamps: true })
export class HrPosition extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  type: HrPositionEmploymentType;

  @Prop()
  status: HrPositionStatus;

  @Prop({ type: sc.Types.ObjectId, ref: () => HrDepartment })
  department: sc.Types.ObjectId | string;

  @Prop()
  description: string;
}

export type HrPositionDocument = HrPosition & Document;
export const HrPositionSchema = SchemaFactory.createForClass(HrPosition);
