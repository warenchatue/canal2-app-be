import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class CreateAccountingDocItemDto {
  @ApiPropertyOptional({ example: 'My awesome accounting document item' })
  @IsString()
  label: string;

  @ApiPropertyOptional({ example: '6011' })
  account: string;

  @ApiPropertyOptional()
  amount?: number;

  @ApiPropertyOptional()
  debit?: number;

  @ApiPropertyOptional()
  credit?: number;
}
