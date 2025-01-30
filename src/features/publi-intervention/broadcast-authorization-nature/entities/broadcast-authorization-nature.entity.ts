import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class BroadcastAuthorizationNature extends Document {
  @Prop({ required: true })
  name: string; // e.g., Nous Chez vous!, Publ Info, etc.

  @Prop({ required: true })
  type: string; // e.g., Publi, PAD, ProgramIntervention, etc.

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TVProgram' })
  program: MongooseSchema.Types.ObjectId;
}

export const BroadcastAuthorizationNatureSchema = SchemaFactory.createForClass(
  BroadcastAuthorizationNature,
);
