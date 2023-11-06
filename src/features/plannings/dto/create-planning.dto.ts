import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreatePlanningDto {
  @ApiProperty({ default: '2023...' })
  @IsString()
  date: Date;

  @ApiPropertyOptional({ example: 'XAFG_7587_2Z7K' })
  code: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  isManualPlay: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  isAutoPlay: boolean;

  @ApiProperty({ example: 'dfd4fsdsdsdd4788' })
  @IsNotEmpty()
  hour: string;

  @ApiProperty({ example: 'dfdfd4f44dfdfd44dffdfdf7' })
  @IsNotEmpty()
  product: string;
}
