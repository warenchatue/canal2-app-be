import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';

@Schema({ timestamps: true })
export class BroadcastAuthorization extends BaseSchema {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Announcer',
    required: true,
  })
  announcer: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Invoice',
  })
  invoice: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Campaign',
  })
  campaign: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'BroadcastAuthorizationNature',
    required: true,
  })
  nature: MongooseSchema.Types.ObjectId;

  @Prop()
  natureDescription: string;

  @Prop()
  date: Date;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'PaymentMethod',
    required: true,
  })
  paymentMethod: MongooseSchema.Types.ObjectId;

  @Prop()
  duration: number; // In minutes

  @Prop()
  hour: string;

  @Prop([String])
  hours: string[];

  @Prop()
  realHours: string[];

  @Prop()
  realHour: string;

  @Prop()
  description: string;

  @Prop()
  participants: string[];

  @Prop()
  questions: string[];

  @Prop()
  note: string;

  @Prop()
  serviceInCharge: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Org' })
  org: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  validator: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  location: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  commercials: MongooseSchema.Types.ObjectId[];

  @Prop()
  contactDetails: string;

  @Prop()
  productionPartner: string;

  @Prop()
  otherProductionPartner: string;

  @Prop()
  keyContact: string;

  @Prop()
  otherKeyContact: string;

  @Prop()
  contactDetailsToShow: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: false })
  validated: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  validatedBy: MongooseSchema.Types.ObjectId;
}

export type BroadcastAuthorizationDocument = BroadcastAuthorization & Document;
export const BroadcastAuthorizationSchema = SchemaFactory.createForClass(
  BroadcastAuthorization,
);
