import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProductType } from '../entities/product.entity';

export class CreateProductDto {
  @ApiProperty({ example: 'df4545s5d4s5d4s5ds54sdds4dssdsdsds' })
  @IsNotEmpty()
  @IsString()
  order: string;

  @ApiProperty({ example: '2023....' })
  @IsNotEmpty()
  date: Date;

  @ApiPropertyOptional({ default: 'Canal 2Or' })
  @IsString()
  product: string;

  @ApiPropertyOptional({ default: 'Canal 2Or' })
  @IsString()
  message: string;

  @ApiProperty({ default: ProductType.SPOT })
  @IsNotEmpty()
  @IsEnum(ProductType)
  type?: ProductType;

  @ApiProperty()
  @IsString()
  logo: string;

  @ApiPropertyOptional()
  file?: string;

  @ApiPropertyOptional()
  duration?: string;

  @ApiPropertyOptional()
  tag?: string;

  @ApiPropertyOptional()
  isPlay?: boolean;
}
