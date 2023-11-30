import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { toBoolean } from 'src/common/helpers';
export class CreateOrderDto {
  @ApiProperty({ example: 'My awesome order' })
  @IsNotEmpty()
  @IsString()
  @Min(5)
  @Max(256)
  label: string;

  @ApiPropertyOptional({ example: 'XAFG_7587' })
  code: string;

  @ApiPropertyOptional({ example: '' })
  paymentCondition: string;

  @ApiProperty()
  @IsString()
  creator: string;

  @ApiPropertyOptional()
  @IsString()
  manager: string;

  @ApiPropertyOptional()
  @IsString()
  validator: string;

  @ApiPropertyOptional()
  requiredAdminValidator: boolean;

  @ApiPropertyOptional()
  @IsString()
  expectedAdminValidator: string;

  @ApiProperty()
  @IsString()
  announcer: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  closed: boolean;

  @ApiPropertyOptional({ example: 'My awesome package description' })
  @IsString()
  @Min(15)
  @Max(512)
  description?: string;

  @ApiPropertyOptional({ example: 'http://' })
  @IsString()
  contractUrl?: string;

  @ApiPropertyOptional({ example: '' })
  invoice?: string;

  @ApiPropertyOptional()
  @IsArray()
  package?: string;

  @ApiPropertyOptional()
  @IsArray()
  org?: string;

  @ApiPropertyOptional()
  amount?: number;

  @ApiPropertyOptional()
  team?: string;

  @ApiPropertyOptional({ example: '[]' })
  items?: any[];
}
