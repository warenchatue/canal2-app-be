import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, PopulateOptions } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';

@Schema({ timestamps: true })
export class HrDepartment extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  description: string;
}

export type HrDepartmentDocument = HrDepartment & Document;
export const HrDepartmentSchema = SchemaFactory.createForClass(HrDepartment);

export const HR_DEPARTMENT_POPULATION = {
  model: 'HrDepartment',
  select: ['name', 'description'],
} as PopulateOptions;
