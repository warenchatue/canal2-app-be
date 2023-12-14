import { BaseSchema } from 'src/common/shared/base-schema';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, PopulateOptions, Schema as sc } from 'mongoose';
import { Notification } from 'src/features/notifications/entities/notification.entity';
import { Role } from 'src/features/roles/entities/role.entity';
import { Country } from 'src/features/countries/entities/country.entity';

export enum AccountProvider {
  local = 'local',
  facebook = 'facebook',
  google = 'google',
  admin = 'admin',
}

export enum UserTeam {
  douala = 'douala',
  yaounde = 'yaounde',
}

@Schema({ timestamps: true })
export class User extends BaseSchema {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  profilePicture: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop({ type: sc.Types.ObjectId, ref: () => Role })
  appRole: sc.Types.ObjectId | string;

  @Prop({ type: sc.Types.ObjectId, ref: () => Country })
  country: sc.Types.ObjectId | string;

  @Prop({ default: UserTeam.douala })
  team: UserTeam;

  @Prop({ default: 0 })
  ownedOrgs: number;

  @Prop({ default: 0 })
  notificationsCount: number;

  @Prop({ default: 0 })
  orgsCount: number;

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => Notification }] })
  notifications: sc.Types.ObjectId[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

export const USER_POPULATION = {
  model: 'User',
  select: ['email', 'phone', 'provider', 'status', 'firstName', 'lastName'],
} as PopulateOptions;
