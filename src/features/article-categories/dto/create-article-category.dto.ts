import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateArticleCategoryDto {
  @ApiPropertyOptional({ default: 'SPOT' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: 'SPOT' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'art cat desc' })
  @IsNotEmpty()
  description: string;
}
