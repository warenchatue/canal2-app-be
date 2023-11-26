import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { toBoolean } from 'src/common/helpers';
export class CreatePackageDto {
  @ApiPropertyOptional({ example: 'XAFG_7587' })
  code: string;

  @ApiProperty({ example: 25 })
  @IsNotEmpty()
  @IsNumber()
  numberSpots: number;

  @ApiPropertyOptional({ example: 25 })
  numberPlay?: number;

  @ApiProperty({ example: 25 })
  @IsNotEmpty()
  @IsNumber()
  numberPaid: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  numberProducts: number;

  @ApiProperty()
  @IsString()
  period: string;

  @ApiPropertyOptional()
  @IsArray()
  products?: string[];

  @ApiPropertyOptional()
  @IsArray()
  plannings?: string[];

  @ApiProperty()
  @IsString()
  creator: string;

  @ApiPropertyOptional()
  @IsString()
  manager: string;

  @ApiPropertyOptional()
  @IsString()
  packageValidator: string;

  @ApiPropertyOptional()
  @IsString()
  planningValidator: string;

  @ApiPropertyOptional()
  @IsString()
  planningValidatorSignature: string;

  @ApiPropertyOptional()
  @IsString()
  adminValidator: string;

  @ApiPropertyOptional()
  requiredAdminValidator: boolean;

  @ApiPropertyOptional()
  @IsString()
  expectedAdminValidator: string;

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

  @ApiPropertyOptional({ example: 'My awesome package description' })
  @IsString()
  @Min(15)
  @Max(512)
  description?: string;

  @ApiPropertyOptional({ example: '' })
  order?: string;

  @ApiPropertyOptional({ example: '' })
  invoice?: string;
}
