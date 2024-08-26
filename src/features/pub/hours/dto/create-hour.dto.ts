import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ProductType } from 'src/features/products/entities/product.entity';

export class CreateHourDto {
  @ApiProperty({ default: '08:25' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: '08H25' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ default: ProductType.SPOT })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiPropertyOptional({ default: 'SPOT' })
  @IsString()
  description: string;
}
