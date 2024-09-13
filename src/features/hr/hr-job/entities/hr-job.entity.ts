import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { HrPosition } from '../../hr-position/entities/hr-position.entity';
import { HrDepartment } from '../../hr-department/entities/hr-department.entity';

export enum JobStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
  PENDING = 'Pending',
  CANCELED = 'Canceled',
}

@Schema({ timestamps: true })
export class HrJob extends BaseSchema {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  requirements: string;

  @Prop()
  location: string;

  @Prop({ type: sc.Types.ObjectId, ref: () => HrPosition })
  position: sc.Types.ObjectId | string;

  @Prop({ type: sc.Types.ObjectId, ref: () => HrDepartment })
  department: sc.Types.ObjectId | string;

  @Prop({ enum: JobStatus, default: JobStatus.OPEN })
  status: JobStatus;

  @Prop({
    type: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
  })
  salaryRange: {
    min: number;
    max: number;
  };

  @Prop()
  applicationDeadline: Date;
}

export type HrJobDocument = HrJob & Document;
export const HrJobSchema = SchemaFactory.createForClass(HrJob);
