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
export class Invoice extends BaseSchema {
  @Prop()
  label: string;

  @Prop()
  code: string;

  @Prop()
  description: string;

  @Prop()
  contractUrl: string;

  @Prop({ type: sc.Types.Mixed })
  items: sc.Types.Mixed | any;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  order: sc.Types.ObjectId;

  @Prop()
  status: string;

  @Prop({ default: false })
  closed: boolean;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  creator: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  manager: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => Announcer })
  announcer: sc.Types.ObjectId | AnnouncerDocument;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  orderValidator: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  adminValidator: sc.Types.ObjectId;

  @Prop({ default: false })
  requiredAdminValidator: boolean;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  expectedAdminValidator: sc.Types.ObjectId;
}

export type InvoiceDocument = Invoice & Document;
export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
