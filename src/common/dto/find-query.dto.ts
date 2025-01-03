import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { State } from '../shared/base-schema';
import { PER_PAGE } from '../vars';

export enum Directions {
  asc = 'asc',
  desc = 'desc',
}

interface SortProps {
  attribute: string;
  direction: Directions;
}

export class FindQueryDto<T> {
  @ApiPropertyOptional({ default: PER_PAGE })
  @IsNumber()
  perPage?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ default: [State.active], enum: State, isArray: true })
  @IsArray()
  @IsEnum(State)
  states?: State[];

  @ApiPropertyOptional({
    default: {
      attribute: 'createdAt',
      direction: Directions.desc,
    },
  })
  sort?: SortProps;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  search?: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  startDate?: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  endDate?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isPaginate?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty()
  where: T;
}
