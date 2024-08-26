import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAssetCategoryDto {
  @ApiPropertyOptional({ default: 'PC' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: 'Ordinateur' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Desc' })
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ default: 1 })
  @IsString()
  level: string;

  @ApiPropertyOptional()
  @IsString()
  parent: string;
}
