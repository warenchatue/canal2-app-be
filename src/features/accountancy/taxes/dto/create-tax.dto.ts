import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTaxDto {
  @ApiProperty({ default: 'TVA' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: '20%' })
  @IsString()
  value: number;

  @ApiPropertyOptional({ default: 'SPOT' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'art desc' })
  @IsString()
  description: string;
}
