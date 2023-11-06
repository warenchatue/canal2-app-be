import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, PopulateOption, Schema as sc } from 'mongoose';
import { User, UserDocument } from 'src/features/users/entities/user.entity';

export enum NotificationType {
  neutral = 'neutral',
  newOrder = 'newOrder',
}

export enum NotificationLevel {
  info = 'info',
  warning = 'warning',
  success = 'success',
  danger = 'danger',
}

@Schema({
  timestamps: true,
})
export class Notification {
  @Prop({ enum: NotificationType, default: NotificationType.neutral })
  type: NotificationType;

  @Prop({ enum: NotificationLevel, default: NotificationLevel.info })
  level: NotificationLevel;

  @Prop({ type: sc.Types.Mixed })
  data: any;

  @Prop()
  link: boolean;

  @Prop({ default: true })
  display: boolean;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ type: [{ type: sc.Types.ObjectId, ref: () => User }] })
  viewedBy: sc.Types.ObjectId[] | string | UserDocument;
}

export type NotificationDocument = Notification & Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);

export const NOTIFICATION_POPULATION = {
  model: 'Notification',
  populate: ['viewedBy'],
} as PopulateOption;
