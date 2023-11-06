import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { AnnouncerType } from '../entities/announcer.entity';

export class CreateAnnouncerDto {
  @ApiPropertyOptional({ default: 'Canal 2 International' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'admin@test.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ default: '+237690909090' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ default: AnnouncerType.personal })
  @IsNotEmpty()
  @IsEnum(AnnouncerType)
  type?: AnnouncerType;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional()
  country?: string;
}
