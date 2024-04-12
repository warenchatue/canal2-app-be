import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { toBoolean } from 'src/common/helpers';
export class CreateTvProgramDto {
  @ApiProperty({ example: 'PROG_001' })
  code: string;

  @ApiProperty({ example: 'Canal Matin' })
  label: string;

  @ApiProperty()
  category: string;

  @ApiProperty({ example: [] })
  @IsArray()
  plannings: number[];

  @ApiProperty()
  @IsString()
  creator: string;

  @ApiPropertyOptional()
  @IsString()
  hosts: string[];

  @ApiPropertyOptional()
  @IsString()
  validator: string;

  @ApiPropertyOptional()
  @IsString()
  validatorSignature: string;

  @ApiPropertyOptional()
  @IsString()
  adminValidator: string;

  @ApiPropertyOptional()
  adminValidated: boolean;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  closed: boolean;

  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  planningValidated: boolean;

  @ApiPropertyOptional({ example: 'My awesome tvProgram description' })
  @IsString()
  @Min(15)
  @Max(512)
  description?: string;

  @ApiPropertyOptional({ example: '' })
  org?: string;
}
