import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { Org } from 'src/features/orgs/entities/org.entity';
import { User } from 'src/features/users/entities/user.entity';
import { ProgramCategory } from '../../programs-categories/entities/program-category.entity';
@Schema({
  timestamps: true,
})
export class TvProgram extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: sc.Types.ObjectId, ref: () => Org })
  org: sc.Types.ObjectId;

  @Prop()
  status: string;

  @Prop({ default: false })
  closed: boolean;

  @Prop({ type: sc.Types.ObjectId, ref: () => ProgramCategory })
  category: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  creator: sc.Types.ObjectId;

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => User }] })
  hosts: sc.Types.ObjectId[] | string[];

  @Prop()
  plannings: any[];

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  validator: sc.Types.ObjectId;

  @Prop()
  validatorSignature: string;

  @Prop({ default: false })
  adminValidated: boolean;
}

export type TvProgramDocument = TvProgram & Document;
export const TvProgramSchema = SchemaFactory.createForClass(TvProgram);
