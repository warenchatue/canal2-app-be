import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class BroadcastAuthorization extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Announcer',
    required: true,
  })
  announcer: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Invoice',
    required: true,
  })
  invoice: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
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

  @Prop([String])
  realHours: string[];

  @Prop()
  realHour: string;

  @Prop()
  description: string;

  @Prop([String])
  participants: string[];

  @Prop([String])
  questions: string[];

  @Prop()
  note: string;

  @Prop()
  serviceInCharge: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  validator: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  adminValidator: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  location: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  commercials: MongooseSchema.Types.ObjectId[];

  @Prop()
  contactDetails: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProductionPartner' })
  productionPartner: MongooseSchema.Types.ObjectId;

  @Prop()
  otherProductionPartner: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  keyContact: MongooseSchema.Types.ObjectId;

  @Prop()
  otherKeyContact: string;

  @Prop()
  contactDetailsToShow: string;

  @Prop({ default: false })
  deleted: boolean;
}

export const BroadcastAuthorizationSchema = SchemaFactory.createForClass(
  BroadcastAuthorization,
);
