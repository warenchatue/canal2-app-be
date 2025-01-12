import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAssetDto {
  @ApiPropertyOptional({ default: 'XYZ123' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: 'immo-01' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Desc' })
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional()
  @IsString()
  category: string;

  @ApiPropertyOptional()
  @IsString()
  brand: string;

  @ApiPropertyOptional()
  @IsString()
  model: string;

  @ApiPropertyOptional()
  @IsString()
  room: string;
}
