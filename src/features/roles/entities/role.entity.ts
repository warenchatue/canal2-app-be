import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';

@Schema({ timestamps: true })
export class Role extends BaseSchema {
  @Prop()
  name: string;

  @Prop()
  tag: string;

  @Prop()
  description: string;

  @Prop()
  permissions: string[];
}

export type RoleDocument = Role & Document;
export const RoleSchema = SchemaFactory.createForClass(Role);
