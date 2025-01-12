import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAssetModelDto {
  @ApiPropertyOptional({ default: 'Bureau' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: 'New Model' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Desc' })
  @IsNotEmpty()
  description: string;
}
