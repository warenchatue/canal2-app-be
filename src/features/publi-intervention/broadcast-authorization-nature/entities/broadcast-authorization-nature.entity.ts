import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TvProgram } from '../../../tv-programs/programs/entities/program.entity'; // Correct import path
import { BaseSchema } from 'src/common/shared/base-schema';

@Schema({ timestamps: true })
export class BroadcastAuthorizationNature extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'TvProgram',
  }) // Reference to TvProgram
  program_id: MongooseSchema.Types.ObjectId;

  @Prop({ default: false })
  deleted: boolean;
}

export type BroadcastAuthorizationNatureDocument =
  BroadcastAuthorizationNature & Document;
export const BroadcastAuthorizationNatureSchema = SchemaFactory.createForClass(
  BroadcastAuthorizationNature,
);

// Ensure _id is always returned as a string in JSON and object responses
const transformResponse = (_doc, ret) => {
  if (ret._id) ret._id = ret._id.toString(); // Convert ObjectId to string
  return ret;
};

BroadcastAuthorizationNatureSchema.set('toJSON', {
  virtuals: true, // Include virtuals
  versionKey: false, // Remove __v field
  transform: transformResponse,
});

BroadcastAuthorizationNatureSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: transformResponse,
});
