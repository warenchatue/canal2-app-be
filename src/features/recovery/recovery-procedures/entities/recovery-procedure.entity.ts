import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import {
  Announcer,
  AnnouncerDocument,
} from 'src/features/announcers/entities/announcer.entity';
import { User } from 'src/features/users/entities/user.entity';
@Schema({
  timestamps: true,
})
export class RecoveryProcedure extends BaseSchema {
  @Prop()
  label: string;

  @Prop()
  code: string;

  @Prop()
  date: string;

  @Prop()
  description: string;

  @Prop()
  amount: number;

  @Prop()
  paid: number;

  @Prop({ type: [{ type: sc.Types.Mixed }] })
  items: sc.Types.Mixed[] | any[];

  @Prop()
  status: string;

  @Prop({ default: false })
  closed: boolean;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  creator: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  agent1: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  agent2: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  agent3: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  agent4: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => Announcer })
  announcer: sc.Types.ObjectId | AnnouncerDocument;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  validator: sc.Types.ObjectId;
}

export type RecoveryProcedureDocument = RecoveryProcedure & Document;
export const RecoveryProcedureSchema =
  SchemaFactory.createForClass(RecoveryProcedure);
