import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import {
  NotificationLevel,
  NotificationType,
} from '../entities/notification.entity';

export class CreateNotificationDto {
  @ApiPropertyOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiPropertyOptional()
  @IsEnum(NotificationLevel)
  level?: NotificationLevel;

  @ApiPropertyOptional()
  data?: any;

  @ApiPropertyOptional()
  link?: string;

  @ApiPropertyOptional()
  completed?: boolean;
}
