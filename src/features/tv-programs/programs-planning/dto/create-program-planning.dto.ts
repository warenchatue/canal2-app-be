import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateProgramPlanningDto {
  @ApiProperty({ default: '2023...' })
  @IsString()
  date: Date;

  @ApiPropertyOptional({ example: 'XAFG_7587_2Z7K' })
  code: string;

  @ApiPropertyOptional({ example: '2023' })
  position: Date;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  isManualPlay: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  isAutoPlay: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  isTvProgram: boolean;

  @ApiPropertyOptional({ example: '7:25' })
  @IsNotEmpty()
  hour?: string;

  @ApiPropertyOptional({ example: 'id' })
  @IsNotEmpty()
  tvProgram?: string;

  @ApiPropertyOptional({ example: '7:28' })
  @IsNotEmpty()
  playedHour: string;

  @ApiProperty({ example: 'dfdfd4f44dfdfd44dffdfdf7' })
  @IsNotEmpty()
  product: string;
}
