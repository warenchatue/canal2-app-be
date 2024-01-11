import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { Org } from 'src/features/orgs/entities/org.entity';
import { Account } from '../../accounts/entities/account.entity';

@Schema({ timestamps: true })
export class Journal extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  label: string;

  @Prop()
  position: string;

  @Prop()
  description: string;

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => Account }] })
  accounts: sc.Types.ObjectId[] | string[];

  @Prop({ type: sc.Types.ObjectId, ref: () => Org })
  org: sc.Types.ObjectId | string;
}

export type JournalDocument = Journal & Document;
export const JournalSchema = SchemaFactory.createForClass(Journal);
