import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class CreateTaxItemDto {
  @ApiPropertyOptional({ example: 'My awesome invoice tax item' })
  @IsString()
  label: string;

  @ApiPropertyOptional()
  date?: string;

  @ApiPropertyOptional()
  account: any;

  @ApiPropertyOptional({ example: 'TVA' })
  accountCode?: string;

  @ApiPropertyOptional({ example: '4452' })
  accountNumber?: string;

  @ApiPropertyOptional()
  amount?: number;
}
