import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import {
  TransactionStatus,
  TransactionType,
} from '../entities/transaction.entity';

export class CreateTransactionDto {
  @ApiPropertyOptional()
  code?: string;

  @ApiPropertyOptional({ example: 'dd/mm/yyyy' })
  date?: string;

  @ApiProperty({ minimum: 100 })
  @IsNotEmpty()
  @Min(100)
  amount: number;

  @ApiProperty({ required: false, minimum: 5, maximum: 255 })
  @IsString()
  @Min(5)
  @Max(255)
  message: string;

  @ApiProperty({ enum: TransactionType })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiPropertyOptional()
  data?: any;

  @ApiPropertyOptional()
  paymentAccount?: string;

  @ApiProperty({ example: '63038d57fba1cb40caa1e0c4' })
  @IsNotEmpty()
  org: string;

  @ApiPropertyOptional()
  validator?: string;

  @ApiPropertyOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional()
  @IsString()
  announcer?: string;

  approved?: boolean;

  status?: TransactionStatus;
}
