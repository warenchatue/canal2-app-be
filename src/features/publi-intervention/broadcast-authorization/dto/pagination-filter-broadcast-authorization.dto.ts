import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class PaginationFilterBroadcastAuthorizationDto {
  @ApiProperty({ example: 1, default: 1 })
  @Type(() => Number)
  @Min(1)
  @IsNumber()
  page: number;

  @ApiProperty({ example: 10, default: 10, maximum: 50 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit: number;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  search?: string;

  @ApiPropertyOptional({ example: '', default: 'all' })
  @IsIn(['open', 'incomplete', 'all'], {
    message: 'Service scope must be either "open" or "incomplete" or "all".',
  })
  @IsOptional()
  @IsString()
  scope?: string;
}
