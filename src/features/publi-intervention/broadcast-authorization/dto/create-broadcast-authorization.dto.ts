import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateBroadcastAuthorizationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  announcer: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  invoice: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  campaign: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nature: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  natureDescription: string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  date: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  startDate: Date;

  @ApiProperty()
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

  @ApiProperty()
  @IsArray()
  @IsOptional()
  hours: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  realHours: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  realHour: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  participants: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  questions: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  note: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  serviceInCharge: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  validator: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  adminValidator: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  commercials: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  contactDetails: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  productionPartner: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  otherProductionPartner: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  keyContact: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  otherKeyContact: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contactDetailsToShow: string;
}
