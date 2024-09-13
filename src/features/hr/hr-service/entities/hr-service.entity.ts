import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { HrDepartment } from '../../hr-department/entities/hr-department.entity';

export enum HrServiceStatus {
  active = 'active',
  inactive = 'inactive',
}

@Schema({ timestamps: true })
export class HrService extends BaseSchema {
  @Prop()
  name: string;

  @Prop()
  status: HrServiceStatus;

  @Prop({ type: sc.Types.ObjectId, ref: () => HrDepartment })
  department: sc.Types.ObjectId | string;

  @Prop()
  description: string;
}

export type HrServiceDocument = HrService & Document;
export const HrServiceSchema = SchemaFactory.createForClass(HrService);
