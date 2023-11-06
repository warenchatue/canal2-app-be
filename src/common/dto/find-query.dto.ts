import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber } from 'class-validator';
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

  @ApiProperty()
  where: T;
}
