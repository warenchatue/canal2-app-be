import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsString, Max, Min } from 'class-validator';
import { toBoolean } from 'src/common/helpers';
import { CreateTaxItemDto } from '../../invoices/dto/create-tax-item.dto';
export class CreatePurchaseInvoiceDto {
  @ApiPropertyOptional({ example: 'My awesome invoice' })
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
  supplier: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  closed: boolean;

  @ApiPropertyOptional({ default: true })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  isDoit: boolean;

  @ApiPropertyOptional({ example: 'My awesome invoice description' })
  @IsString()
  @Min(5)
  @Max(512)
  description?: string;

  @ApiPropertyOptional({ example: 'My awesome invoice note' })
  @IsString()
  @Min(5)
  @Max(512)
  note?: string;

  @ApiPropertyOptional()
  order?: string;

  @ApiPropertyOptional()
  org?: string;

  @ApiPropertyOptional()
  from?: string;

  @ApiPropertyOptional()
  team?: string;

  @ApiPropertyOptional()
  amountHT?: number;

  @ApiPropertyOptional()
  amount?: number;

  @ApiPropertyOptional()
  paid?: number;

  @ApiPropertyOptional()
  tva?: number;

  @ApiPropertyOptional()
  tsp?: number;

  @ApiPropertyOptional({ example: '[]' })
  items?: any[];

  @ApiPropertyOptional({ isArray: true, type: CreateTaxItemDto })
  @IsArray()
  taxes?: CreateTaxItemDto[];

  @ApiPropertyOptional({ example: '[]' })
  transactions?: string[];
}
