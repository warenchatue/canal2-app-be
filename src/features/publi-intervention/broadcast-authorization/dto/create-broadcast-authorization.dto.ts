import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsArray,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateBroadcastAuthorizationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  announcer: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  invoice?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  campaign: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nature: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  natureDescription: string;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  date: Date;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  startDate: Date;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  endDate: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  duration: number; // In minutes

  @ApiProperty()
  @IsString()
  @IsOptional()
  hour: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  hours: string[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  realHours: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  realHour: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  participants: string[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  questions: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  note: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  serviceInCharge: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  validator: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  adminValidator: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  commercials: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contactDetails: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  productionPartner: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  otherProductionPartner: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  keyContact: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  otherKeyContact: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contactDetailsToShow: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  validated?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  validatedBy?: string;
}
