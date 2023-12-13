import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { AnnouncerType } from '../entities/announcer.entity';

export class CreateAnnouncerDto {
  @ApiPropertyOptional({ default: 'CLT0001' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: 'Canal 2 International' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'admin@test.com' })
  email: string;

  @ApiPropertyOptional({ default: '+237690909090' })
  @IsPhoneNumber()
  phone: string;

  @ApiPropertyOptional({ default: '+237690909010' })
  @IsPhoneNumber()
  phone2: string;

  @ApiPropertyOptional({ default: '' })
  @IsPhoneNumber()
  rc: string;

  @ApiPropertyOptional({ default: '' })
  @IsPhoneNumber()
  nc: string;

  @ApiProperty({ default: AnnouncerType.personal })
  @IsNotEmpty()
  @IsEnum(AnnouncerType)
  type?: AnnouncerType;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional()
  country?: string;
}
