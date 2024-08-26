import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsString, Max, Min } from 'class-validator';
import { toBoolean } from 'src/common/helpers';
export class CreatePurchaseOrderDto {
  @ApiPropertyOptional({ example: 'My awesome order' })
  @IsString()
  label: string;

  @ApiPropertyOptional({ example: 'BC/2023/0001' })
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

  @ApiPropertyOptional({ example: 'My awesome order description' })
  @IsString()
  @Min(5)
  @Max(512)
  description?: string;

  @ApiPropertyOptional({ example: 'My awesome order note' })
  @IsString()
  @Min(5)
  @Max(512)
  note?: string;

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
