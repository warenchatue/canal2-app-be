import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, PopulateOptions, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { Country } from 'src/features/countries/entities/country.entity';
import { Notification } from 'src/features/notifications/entities/notification.entity';

export enum AnnouncerType {
  corporate = 'corporate',
  personal = 'personal',
}

export enum AnnouncerStatus {
  active = 'active',
  inactive = 'inactive',
}

export enum AnnouncerCategory {
  largeAccount = 'largeAccount',
  bank = 'bank',
  school = 'school',
  PME = 'PME',
  TPE = 'TPE',
}

@Schema({ timestamps: true })
export class Announcer extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  city: string;

  @Prop()
  address: string;

  @Prop()
  profilePicture: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  phone2: string;

  @Prop()
  rc: string;

  @Prop()
  nc: string;

  @Prop()
  niu: string;

  @Prop({ type: sc.Types.ObjectId, ref: () => Country })
  country: sc.Types.ObjectId | string;

  @Prop()
  status: AnnouncerStatus;

  @Prop()
  type: AnnouncerType;

  @Prop()
  category: AnnouncerCategory;

  @Prop({ default: 0 })
  notificationsCount: number;

  @Prop({ default: 0 })
  packagesCount: number;

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => Notification }] })
  notifications: sc.Types.ObjectId[];
}

export type AnnouncerDocument = Announcer & Document;
export const AnnouncerSchema = SchemaFactory.createForClass(Announcer);

export const USER_POPULATION = {
  model: 'Announcer',
  select: ['email', 'phone', 'status', 'name'],
} as PopulateOptions;
