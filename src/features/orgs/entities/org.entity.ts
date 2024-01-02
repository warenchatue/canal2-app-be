import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import {
  Country,
  CountryDocument,
} from 'src/features/countries/entities/country.entity';
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

  @Prop({ type: sc.Types.ObjectId, ref: () => Country })
  country: sc.Types.ObjectId | string | CountryDocument;

  @Prop()
  medias: sc.Types.Mixed;

  @Prop()
  phone: string;

  @Prop()
  phone2: string;

  @Prop()
  city: string;

  @Prop()
  description: string;

  @Prop()
  logo: string;

  @Prop()
  nc: string;

  @Prop()
  rc: string;

  @Prop()
  address: string;

  @Prop()
  footerTitle: string;

  @Prop({ type: sc.Types.ObjectId, ref: () => User })
  owner: sc.Types.ObjectId | string | UserDocument;

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => User }] })
  members: sc.Types.ObjectId[] | string[] | UserDocument[];

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => User }] })
  banned: sc.Types.ObjectId[];
}

export type OrgDocument = Org & Document;
export const OrgSchema = SchemaFactory.createForClass(Org);
