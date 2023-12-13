import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsString, Max, Min } from 'class-validator';
import { toBoolean } from 'src/common/helpers';
export class CreateInvoiceDto {
  @ApiPropertyOptional({ example: 'My awesome bill' })
  @IsString()
  label: string;

  @ApiPropertyOptional({ example: 'FAC/2023/001' })
  code: string;

  @ApiPropertyOptional({ example: 'dd/mm/yyyy' })
  date: string;

  @ApiPropertyOptional({ example: 'dd/mm/yyyy' })
  dueDate: string;

  @ApiPropertyOptional({ example: '' })
  paymentMethod: string;

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
