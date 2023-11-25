import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaxDto {
  @ApiPropertyOptional({ default: 'TVA' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: '20%' })
  @IsString()
  value: number;

  @ApiPropertyOptional({ default: 'SPOT' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'art desc' })
  @IsNotEmpty()
  @IsEmail()
  description: string;
}
