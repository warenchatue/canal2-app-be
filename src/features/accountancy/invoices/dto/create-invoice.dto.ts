import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { toBoolean } from 'src/common/helpers';
export class CreateInvoiceDto {
  @ApiProperty({ example: 'My awesome bill' })
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

  @ApiPropertyOptional()
  order?: string;

  @ApiPropertyOptional()
  org?: string;

  @ApiPropertyOptional()
  amount?: number;

  @ApiPropertyOptional()
  team?: string;

  @ApiPropertyOptional()
  paid?: number;

  @ApiPropertyOptional({ example: '[]' })
  items?: any[];

  @ApiPropertyOptional({ example: '[]' })
  transactions?: string[];
}
