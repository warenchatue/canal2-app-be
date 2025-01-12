import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { HourProgramPlanningDto } from './hour-program-planning';

export class CreateProgramPlanningDto {
  @ApiProperty({ default: '2023...' })
  @IsString()
  date: Date;

  @ApiPropertyOptional({ example: 'XAFG_7587_2Z7K' })
  code: string;

  @ApiPropertyOptional({ example: 'description' })
  description: string;

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
  isDefault: boolean;

  @ApiPropertyOptional({ example: '7:25' })
  hours?: HourProgramPlanningDto[];

  @ApiPropertyOptional()
  procedures?: any[];

  @ApiPropertyOptional()
  @IsString()
  dates: Date[];

  @ApiPropertyOptional({ example: 'id' })
  @IsNotEmpty()
  tvProgram?: string;

  @ApiPropertyOptional({ example: 'content' })
  @IsNotEmpty()
  content?: string;

  @ApiPropertyOptional({ example: 'id' })
  @IsNotEmpty()
  tvProgramHost?: string;

  @ApiPropertyOptional({ example: '7:28' })
  @IsNotEmpty()
  playedHour: string;
}
