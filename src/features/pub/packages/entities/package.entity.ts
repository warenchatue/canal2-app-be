import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { Invoice } from 'src/features/accountancy/invoices/entities/invoice.entity';
import {
  Announcer,
  AnnouncerDocument,
} from 'src/features/announcers/entities/announcer.entity';
import { Order } from 'src/features/orders/entities/order.entity';
import { Org } from 'src/features/orgs/entities/org.entity';
import { Product } from 'src/features/products/entities/product.entity';
import { Planning } from 'src/features/pub/plannings/entities/planning.entity';
import { TvProgram } from 'src/features/tv-programs/programs/entities/program.entity';
import { User } from 'src/features/users/entities/user.entity';
@Schema({
  timestamps: true,
})
export class Campaign extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  label: string;

  @Prop()
  numberSpots: number;

  @Prop()
  numberPaid: number;

  @Prop()
  numberProducts: number;

  @Prop()
  quantities: number;

  @Prop()
  numberPlay: number;

  @Prop()
  period: string;

  @Prop()
  description: string;

  @Prop({ type: sc.Types.ObjectId, ref: () => Org })
  org: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => Order })
  order: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => Invoice })
  invoice: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => Announcer })
  announcer: sc.Types.ObjectId | AnnouncerDocument;

  @Prop()
  status: string;

  @Prop({ default: false })
  closed: boolean;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  creator: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  manager: sc.Types.ObjectId;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  validator: sc.Types.ObjectId;

  @Prop()
  validatorSignature: string;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  adminValidator: sc.Types.ObjectId;

  @Prop({ default: false })
  adminValidated: boolean;

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => Product }] })
  products: sc.Types.ObjectId[] | string[];

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => Planning }] })
  plannings: sc.Types.ObjectId[] | string[];

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => TvProgram }] })
  tvPrograms: sc.Types.ObjectId[] | string[];
}

export type CampaignDocument = Campaign & Document;
export const CampaignSchema = SchemaFactory.createForClass(Campaign);
