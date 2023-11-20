import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { User, UserDocument } from 'src/features/users/entities/user.entity';

@Schema({ timestamps: true })
export class Org extends BaseSchema {
  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  email: string;

  @Prop()
  website: string;

  @Prop()
  country: sc.Types.Mixed;

  @Prop()
  medias: sc.Types.Mixed;

  @Prop()
  description: string;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  owner: sc.Types.ObjectId | string | UserDocument;

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => User }] })
  administrators: sc.Types.ObjectId[];

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => User }] })
  members: sc.Types.ObjectId[] | string[] | UserDocument[];

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => User }] })
  pending: sc.Types.ObjectId[];

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => User }] })
  banned: sc.Types.ObjectId[];

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => User }] })
  donors: sc.Types.ObjectId[];
}

export type OrgDocument = Org & Document;
export const OrgSchema = SchemaFactory.createForClass(Org);
