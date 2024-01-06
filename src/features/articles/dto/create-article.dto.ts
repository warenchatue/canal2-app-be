import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiPropertyOptional({ default: 'SPOT 30s' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: 'SPOT' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ default: '0' })
  @IsString()
  price: number;

  @ApiProperty({ example: 'art desc' })
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional()
  category?: string;
}
