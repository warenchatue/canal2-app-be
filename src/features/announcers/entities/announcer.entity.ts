import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, PopulateOptions, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { Country } from 'src/features/countries/entities/country.entity';
import { Notification } from 'src/features/notifications/entities/notification.entity';

export enum AnnouncerType {
  corporate = 'corporate',
  personal = 'personal',
}

@Schema({ timestamps: true })
export class Announcer extends BaseSchema {
  @Prop()
  name: string;

  @Prop()
  profilePicture: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop({ type: sc.Types.ObjectId, ref: () => Country })
  country: sc.Types.ObjectId | string;

  @Prop({ default: AnnouncerType.personal })
  type: AnnouncerType;

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
