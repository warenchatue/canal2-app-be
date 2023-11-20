import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateArticleDto {
  @ApiPropertyOptional({ default: 'SPOT' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'art desc' })
  @IsNotEmpty()
  @IsEmail()
  description: string;

  @ApiPropertyOptional()
  category?: string;
}
