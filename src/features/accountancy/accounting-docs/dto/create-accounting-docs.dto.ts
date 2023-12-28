import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsString, Max, Min } from 'class-validator';
import { toBoolean } from 'src/common/helpers';
import { CreateAccountingDocItemDto } from './create-accounting-doc-item.dto';
export class CreateAccountingDocDto {
  @ApiPropertyOptional({ example: 'My awesome accounting document' })
  @IsString()
  label: string;

  @ApiPropertyOptional({ example: 'PC/2023/001' })
  code: string;

  @ApiPropertyOptional({ example: 'dd/mm/yyyy' })
  date: string;

  @ApiPropertyOptional({ example: '' })
  paymentAccount: string;

  @ApiProperty()
  @IsString()
  creator: string;

  @ApiPropertyOptional()
  @IsString()
  beneficiary: string;

  @ApiPropertyOptional()
  @IsString()
  validator: string;

  @ApiPropertyOptional()
  @IsString()
  authorizer: string;

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
  beneficiaryValidated: boolean;

  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  authorizerValidated: boolean;

  @ApiPropertyOptional({ example: 'My awesome accounting doc description' })
  @IsString()
  @Min(15)
  @Max(512)
  description?: string;

  @ApiPropertyOptional()
  org?: string;

  @ApiPropertyOptional()
  team?: string;

  @ApiPropertyOptional()
  amount?: number;

  @ApiPropertyOptional({ type: CreateAccountingDocItemDto })
  items?: CreateAccountingDocItemDto[];
}
