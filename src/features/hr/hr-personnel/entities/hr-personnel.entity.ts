import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { User } from '../../../users/entities/user.entity';
import { HrPosition } from '../../hr-position/entities/hr-position.entity';
import { HrAddress } from '../../hr-address/entities/hr-address.entity';

export enum EmploymentStatus {
  ACTIVE = 'Active',
  TERMINATED = 'Terminated',
  ON_LEAVE = 'On Leave',
  RETIRED = 'Retired',
}

@Schema({ timestamps: true })
export class HrPersonnel extends BaseSchema {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  gender: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  salary: number;

  @Prop({
    type: {
      name: String,
      phone: String,
      relationship: String,
    },
  })
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };

  @Prop({ enum: EmploymentStatus, default: EmploymentStatus.ACTIVE })
  employmentStatus: EmploymentStatus;

  @Prop({ type: sc.Types.ObjectId, ref: () => HrPersonnel })
  manager: sc.Types.ObjectId | string;

  @Prop({ type: sc.Types.ObjectId, ref: () => HrPosition })
  position: sc.Types.ObjectId | string;

  @Prop({ type: sc.Types.ObjectId, ref: () => HrAddress })
  address: sc.Types.ObjectId | string;

  // @Prop({ type: sc.Types.ObjectId, ref: () => User })
  // userId: sc.Types.ObjectId | string;
}

export type HrPersonnelDocument = HrPersonnel & Document;
export const HrPersonnelSchema = SchemaFactory.createForClass(HrPersonnel);
