import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentConditionDto {
  @ApiPropertyOptional({ default: '30 jours 100%' })
  @IsString()
  label: string;

  @ApiPropertyOptional({ default: '30' })
  delay: number;

  @ApiProperty({ example: 'pc desc' })
  @IsNotEmpty()
  @IsEmail()
  description: string;

  @ApiPropertyOptional()
  category?: string;
}
