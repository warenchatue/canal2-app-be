import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
  @ApiPropertyOptional({ default: 'TVA' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: 'TVA' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ default: 0 })
  @IsString()
  value: number;

  @ApiProperty({ example: 'tax desc' })
  @IsNotEmpty()
  @IsEmail()
  description: string;

  @ApiPropertyOptional()
  category?: string;
}
