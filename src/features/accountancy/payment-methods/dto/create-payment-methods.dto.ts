import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentMethodDto {
  @ApiPropertyOptional({ default: 'Cash' })
  @IsString()
  label: string;

  @ApiProperty({ example: 'en espèces' })
  @IsNotEmpty()
  @IsEmail()
  description: string;

  @ApiPropertyOptional()
  category?: string;
}
