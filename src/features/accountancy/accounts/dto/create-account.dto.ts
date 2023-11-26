import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
  @ApiPropertyOptional({ default: '7011' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: 'Fournisseur' })
  @IsString()
  label: string;

  @ApiPropertyOptional({ default: 0 })
  @IsString()
  position: number;

  @ApiProperty({ example: 'tax desc' })
  @IsNotEmpty()
  @IsEmail()
  description: string;

  @ApiPropertyOptional()
  category?: string;
}
