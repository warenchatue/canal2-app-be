import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  HrPositionEmploymentType,
  HrPositionStatus,
} from '../entities/hr-position.entity';

export class CreateHrPositionDto {
  @ApiPropertyOptional({ default: 'pos001' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: 'intern' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(HrPositionEmploymentType)
  type?: HrPositionEmploymentType;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(HrPositionStatus)
  status?: HrPositionStatus;

  @ApiPropertyOptional({ default: 'hr dept' })
  @IsString()
  department: string;

  @ApiProperty({ example: 'hr pos desc' })
  @IsNotEmpty()
  description: string;
}
